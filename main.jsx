import React,{useEffect,useState}from'react'
import{createRoot}from'react-dom/client'
import{supabase}from'./supabase'
import'./style.css'

function App(){
 const [session,setSession]=useState(null),[profile,setProfile]=useState(null),[posts,setPosts]=useState([]),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[username,setUsername]=useState(''),[body,setBody]=useState(''),[file,setFile]=useState(null),[comments,setComments]=useState({}),[msg,setMsg]=useState('')
 useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const{data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>data.subscription.unsubscribe()},[])
 useEffect(()=>{if(session){loadProfile();loadPosts()}},[session])
 async function loadProfile(){const{data}=await supabase.from('profiles').select('*').eq('id',session.user.id).single();setProfile(data)}
 async function loadPosts(){const{data}=await supabase.from('posts').select('*,profiles(username,avatar_url,is_admin),likes(user_id),comments(id,user_id,body,created_at,profiles(username))').order('created_at',{ascending:false});setPosts(data||[])}
 async function signup(){setMsg('');const{error}=await supabase.auth.signUp({email,password});if(error)return setMsg(error.message);setMsg('注册成功，请检查邮箱验证（如果项目开启了邮箱验证）。')}
 async function signin(){setMsg('');const{error}=await supabase.auth.signInWithPassword({email,password});if(error)setMsg(error.message)}
 async function saveProfile(){if(!username.trim())return;const{error}=await supabase.from('profiles').upsert({id:session.user.id,username:username.trim()});if(error)setMsg(error.message);else loadProfile()}
 async function publish(){if(!body.trim()&&!file)return;let image_url=null;if(file){const path=`${session.user.id}/${crypto.randomUUID()}-${file.name}`;const{error}=await supabase.storage.from('post-images').upload(path,file);if(error)return setMsg(error.message);image_url=supabase.storage.from('post-images').getPublicUrl(path).data.publicUrl}const{error}=await supabase.from('posts').insert({user_id:session.user.id,body:body.trim()||null,image_url});if(error)setMsg(error.message);else{setBody('');setFile(null);await loadPosts()}}
 async function toggleLike(p){const liked=(p.likes||[]).some(x=>x.user_id===session.user.id);if(liked)await supabase.from('likes').delete().eq('post_id',p.id).eq('user_id',session.user.id);else await supabase.from('likes').insert({post_id:p.id,user_id:session.user.id});loadPosts()}
 async function addComment(id,text){if(!text.trim())return;await supabase.from('comments').insert({post_id:id,user_id:session.user.id,body:text.trim()});loadPosts()}
 async function del(id){if(!profile?.is_admin)return;await supabase.from('posts').delete().eq('id',id);loadPosts()}
 if(!session)return <main className="center"><div className="card auth"><h1>一起分享</h1><p>人人都可以发布图片和文字</p><input placeholder="邮箱" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)}/><button onClick={signin}>登录</button><button className="secondary" onClick={signup}>注册</button>{msg&&<small>{msg}</small>}</div></main>
 if(!profile)return <main className="center"><div className="card"><h2>设置你的昵称</h2><input placeholder="昵称" value={username} onChange={e=>setUsername(e.target.value)}/><button onClick={saveProfile}>保存并进入</button></div></main>
 return <><header><b>一起分享</b><span>{profile.username}{profile.is_admin?' · 管理员':''} <button className="mini" onClick={()=>supabase.auth.signOut()}>退出</button></span></header><main>
 <section className="card"><textarea placeholder="分享点什么……" value={body} onChange={e=>setBody(e.target.value)}/><input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)}/><button onClick={publish}>发布</button>{msg&&<small>{msg}</small>}</section>
 {posts.map(p=><article className="card post" key={p.id}><div className="who"><img src={p.profiles?.avatar_url||`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(p.profiles?.username||'?')}`}/><div><b>{p.profiles?.username||'用户'}</b>{p.profiles?.is_admin&&<em>管理员</em>}<small>{new Date(p.created_at).toLocaleString()}</small></div></div>{p.body&&<div className="body">{p.body}</div>}{p.image_url&&<img className="photo" src={p.image_url}/>}<div><button className="mini" onClick={()=>toggleLike(p)}>❤️ {(p.likes||[]).length}</button>{profile.is_admin&&<button className="mini danger" onClick={()=>del(p.id)}>删除</button>}</div><div className="comments">{(p.comments||[]).map(c=><div key={c.id}><b>{c.profiles?.username||'用户'}</b>：{c.body}</div>)}<CommentBox onSend={t=>addComment(p.id,t)}/></div></article>)}</main></>}
function CommentBox({onSend}){const[t,setT]=useState('');return <div className="commentbox"><input placeholder="写评论…" value={t} onChange={e=>setT(e.target.value)}/><button className="mini" onClick={()=>{onSend(t);setT('')}}>评论</button></div>}
createRoot(document.getElementById('root')).render(<App/>)
