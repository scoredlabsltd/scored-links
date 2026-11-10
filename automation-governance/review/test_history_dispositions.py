"""SC-BE-53 exact history attribution. Real pinned scanner; no raw values logged."""
import argparse,base64,hashlib,json,re,subprocess,tempfile,unittest
from pathlib import Path

def git(root,*args):return subprocess.check_output(['git','-C',str(root),*args],stderr=subprocess.DEVNULL)
def lines(s):return {x for x in s.splitlines() if x and not x.startswith('#')}
class HistoryDispositions(unittest.TestCase):
 def entries(self):return json.loads((REPO/'automation-governance/review/historical-dispositions.json').read_text())
 def approved(self):return [x for x in self.entries()['entries'] if x['disposition'].startswith('proposed')]
 def scan(self,root,ignore):
  out=root/'result.json';r=subprocess.run([str(SCANNER),'git',str(root),'--log-opts=--all','--redact=100','--gitleaks-ignore-path',str(ignore),'--report-format=json','--report-path',str(out)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);return r.returncode,json.loads(out.read_text())
 def test_only_exact_catalog_fingerprints_added(self):
  d=self.entries();old=git(REPO,'show',d['baseline']+':.gitleaksignore').decode() if git(REPO,'ls-tree',d['baseline'],'.gitleaksignore') else ''
  actual=lines((REPO/'.gitleaksignore').read_text());self.assertEqual(actual,lines(old)|{p['fingerprint'] for p in self.approved()})
  for p in d['entries']:
   self.assertEqual(p['fingerprint'],f"{p['commit']}:{p['path']}:{p['rule']}:{p['line']}")
   if p['rule']=='gcp-api-key':self.assertNotIn(p['fingerprint'],actual)
 def test_immutable_objects_and_classifications(self):
  for p in self.entries()['entries']:
   data=git(REPO,'show',p['commit']+':'+p['path']);self.assertEqual(git(REPO,'rev-parse',p['commit']+':'+p['path']).decode().strip(),p['source_blob']);self.assertEqual(hashlib.sha256(data).hexdigest(),p['source_sha256']);line=data.decode().splitlines()[p['line']-1];self.assertEqual(hashlib.sha256(line.encode()).hexdigest(),p['line_sha256'])
   self.assertEqual(hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest(),p['source_blob'])
   if p['rule']=='jwt':
    token=re.search(r'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+',line).group();claims=json.loads(base64.urlsafe_b64decode(token.split('.')[1]+'==='));self.assertEqual(claims['role'],'anon');self.assertEqual(claims['iss'],'supabase');self.assertEqual(hashlib.sha256(token.encode()).hexdigest(),p['value_sha256'])
   elif 'snapshot' in p['classification']:self.assertRegex(line,r'"pair_tokens_hash": "[a-f0-9]+"');self.assertNotIn('"token":',line)
   elif p['rule']=='generic-api-key':self.assertTrue(line.startswith('4. score-sync validates inputs'));self.assertNotIn('=',line)
 def test_unignored_full_history_reproduces_every_original_finding(self):
  with tempfile.TemporaryDirectory(prefix='scored-history-proof-') as td:
   r=Path(td);bare=r/'history.git';git(r,'clone','--quiet','--bare','--shared',str(REPO),str(bare));ignore=r/'none';ignore.write_text('');code,rows=self.scan(bare,ignore);self.assertEqual(code,1);actual={x['Fingerprint'] for x in rows};self.assertTrue({x['fingerprint'] for x in self.entries()['entries']}<=actual)
 def fixture(self,p,mode):
  with tempfile.TemporaryDirectory(prefix='scored-history-control-') as td:
   r=Path(td);git(r,'init','-q');git(r,'config','user.name','Synthetic');git(r,'config','user.email','synthetic@example.invalid');f=r/p['path'];f.parent.mkdir(parents=True,exist_ok=True);sample=''.join('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[(i*17+3)%62] for i in range(36))
   if mode=='exact':rows=[git(REPO,'show',p['commit']+':'+p['path']).decode().splitlines()[p['line']-1]]*2;expected={p['rule']}
   elif mode=='hash':rows=['api_key = "'+hashlib.sha256(b'nonissued deterministic digest fixture').hexdigest()+'"']*2;expected={'generic-api-key'}
   else:
    enc=lambda x:base64.urlsafe_b64encode(json.dumps(x,separators=(',',':')).encode()).decode().rstrip('=')
    # Deliberately synthetic unsigned/unusable JWT, valid scanner format; not a provider token.
    jwt=enc({'alg':'HS256','typ':'JWT'})+'.'+enc({'role':'service_role','iss':'synthetic.invalid','sub':'nonissued'})+'.'+base64.urlsafe_b64encode(b'deterministic nonissued signature bytes').decode().rstrip('=')
    rows=['github_token = "'+('gh'+'p_')+sample+'"','api_key = "'+sample+'"','credential = "'+jwt+'"','google_key = "'+('AI'+'za')+sample[:35]+'"'];expected={'github-pat','generic-api-key','jwt','gcp-api-key'}
   f.write_text('\n'.join(['# synthetic']*(p['line']-1)+rows)+'\n');git(r,'add','.');git(r,'commit','-qm','Nonissued history control');code,found=self.scan(r,REPO/'.gitleaksignore');self.assertEqual(code,1);self.assertTrue(expected<={x['RuleID'] for x in found},'All required synthetic rule cases must be detected')
   if mode in ('exact','hash'):self.assertEqual({x['StartLine'] for x in found},{p['line'],p['line']+1})
 def test_unrelated_credentials_at_every_historical_path_and_line(self):
  for p in self.entries()['entries']:self.fixture(p,'credentials')
 def test_same_values_in_future_commits_and_adjacent_lines_still_detected(self):
  for p in self.approved():self.fixture(p,'exact')
 def test_changed_and_repeated_hashes_still_detected(self):
  for p in self.approved():self.fixture(p,'hash')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--scanner',type=Path,required=True);p.add_argument('--repository',type=Path,required=True);a,rest=p.parse_known_args();SCANNER=a.scanner.resolve();REPO=a.repository.resolve();assert subprocess.check_output([str(SCANNER),'version'],text=True).strip()=='8.30.1';unittest.main(argv=['test_history_dispositions',*rest],verbosity=2)
