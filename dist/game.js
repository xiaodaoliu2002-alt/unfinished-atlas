'use strict';

// All events are fictional, predetermined archival reconstructions.
// No network, account, or generative model is needed during play.
const KEY = 'unfinished-atlas-save-v1';
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const labels = {include:'收录', pending:'待核', private:'不公开'};
const characters = {
  wen:{name:'闻岑',role:'档案协调员 · 现场',pos:'0% 0%'},
  zhou:{name:'周师傅',role:'加工岗位 · 记忆重构',pos:'50% 0%'},
  chen:{name:'陈阿姨',role:'材料提供者 · 现场',pos:'100% 0%'},
  clerk:{name:'报务员',role:'通信岗位 · 记忆重构',pos:'0% 100%'},
  xu:{name:'许宁',role:'展示编辑 · 现场',pos:'50% 100%'},
  reader:{name:'第一位读者',role:'记忆馆访客 · 现场',pos:'100% 100%'}
};
const chapters = [
  {title:'加工完成，待交',short:'车间',subtitle:'一只伸出照片的手',person:'zhou',intro:'两件都做完了。别把跟着它们走的纸弄混。你想知道的，都先从这些记录里找。',docs:['factory','samples','process','draft1','inspection','receipt'],initial:['factory','draft1'],facts:['purpose','scope','received'],claims:[
    {id:'sample-a',text:'样件 A 留下做演示。',answer:'include'},
    {id:'sample-b',text:'样件 B 已完成加工、检验及本次交接。',answer:'include'},
    {id:'destination',text:'样件 B 此后的去向。',answer:'pending'}
  ],end:'照片里，除了机器，还有一个等着接东西的人。你留下了本次交接，也为后来的去向留了一处空白。'},
  {title:'照片里没有等待',short:'家庭',subtitle:'同一台电视，两种记忆',person:'chen',intro:'电视你们已经收了。这些纸，你们还要不要？有些事，光看那张合照是看不出来的。',docs:['family','repair','oral','letter','draft2'],initial:['family','repair'],facts:['dates','general'],claims:[
    {id:'family-night',text:'一家人曾共同观看，也经历过维修等待。',answer:'include'},
    {id:'repair-public',text:'匿名后的维修单，可作为公开附件。',answer:'include'},
    {id:'letter-private',text:'陈阿姨暂不授权展示的私人信件。',answer:'private'}
  ],end:'热闹和等待都被留下了。私人信件交还给陈阿姨，公开的维修单隐去了姓名与地址。'},
  {title:'收到，不等于明白',short:'通信',subtitle:'文字一致，意思却走了样',person:'clerk',intro:'发出的内容在这里，收到的那份也在。你可以逐字核。但我只能确认我处理过的这一份。',docs:['original','received','action','followup','draft3'],initial:['original','received'],facts:['identical','conflict','unknown'],claims:[
    {id:'same-words',text:'现存原稿与接收抄件的文字一致。',answer:'include'},
    {id:'misunderstood',text:'拟办内容与原要求冲突，后来发生过回问。',answer:'include'},
    {id:'saved-material',text:'这批材料最终得到了保存。',answer:'pending'}
  ],end:'你确认了文字如何被送达，也找到了理解上的偏差。材料的最终去向，仍然需要另一份记录。'},
  {title:'请留下一个入口',short:'编排',subtitle:'让后来的人，愿意继续问',person:'xu',intro:'材料有了。现在做第一页。放不下的留在附件里；第一页得让人知道，自己为什么想翻下去。'}
];
const pageData=[
  {title:'车间里的交接',photo:'workshop',object:'一台用于加工的设备',question:'加工完成了，照片边缘的人还在等什么？',summary:'A 留作演示。B 完成本次交接。后续去向待核。',attachment:'加工单、用途卡、检验及接收记录',readerObject:'这台机器是做什么的？',readerQuestion:'这只手，是来接东西的吗？他接过去以后，又交给谁了？',blank:'样件 B 的后续去向，待查。'},
  {title:'电视旁的一家人',photo:'family',object:'一台家庭使用的电视',question:'同一台电视，为什么有人记得热闹，有人记得等待？',summary:'共同观看与维修等待都曾发生。私人信件不公开。',attachment:'家庭照片、口述记录、匿名维修单',readerObject:'这台电视是他们家什么时候买的？',readerQuestion:'一起看电视的晚上我看见了。等维修的那几天，他们又是怎么过的？',blank:'维修等待之外的家庭经历，待查。'},
  {title:'一封被收到的消息',photo:'message',object:'一份文字一致的消息抄件',question:'字都送到了，为什么还要再问一次？',summary:'文字一致，拟办内容存在误解。最终处置记录缺失。',attachment:'原稿、接收抄件、拟办便条、回问记录',readerObject:'原来以前的消息，是这样传递的。',readerQuestion:'后来再问了一次。那么，这批材料最后保存下来了吗？',blank:'这批材料的最终处置，待查。'}
];
const pairs=[
  {chapter:0,keys:['sample-a','draft-both'],fact:'purpose',person:'zhou',speech:'A 留下做演示，B 才往后走。两件外形差不多，用途却不同。别把它们一起写成交出去了。',message:'已核对：A 留样，B 进入后续交接。'},
  {chapter:0,keys:['photo-pending','draft-direct'],fact:'scope',person:'zhou',speech:'我说做完了，是我这一步做完了。阿唐核过 B，接收的事还得找接收记录。检验单给你。',message:'发现新材料：检验记录、接收记录。'},
  {chapter:1,keys:['photo-date','repair-date'],fact:'dates',person:'chen',speech:'不是同一个晚上。照片拍完过了几天，它才坏。一起看是真的，等维修也是真的。',message:'日期成立：1 月 12 日观看，1 月 20 日报修。'},
  {chapter:1,keys:['photo-date','draft-every'],fact:'general',person:'chen',speech:'那是拍照片的一个晚上。别写成我们天天这样。照片和维修单可以展示，单子上的姓名、地址请遮掉。',message:'一张照片不能支持“每晚”。请处理维修单中的私人信息。'},
  {chapter:2,keys:['original-message','received-message'],fact:'identical',person:'clerk',speech:'对，现存的原稿与接收抄件，文字一致。但这只能证明纸上写了什么，不能证明对方后来做了什么。',message:'已核对：现存两份文字一致。'},
  {chapter:2,keys:['original-message','action-clear'],fact:'conflict',person:'clerk',speech:'原稿说先保存，那张便条却准备先清掉。后来有人又去问了保存范围，回问记录在这里。',message:'发现新材料：后续回问记录。'}
];
function fresh(){return {version:1,screen:'landing',chapter:0,started:false,completed:[],facts:[],read:[],stamps:{},redacted:[],visible:['factory','draft1'],selectedClue:null,activeClaim:0,flipped:false,sound:false,headlines:['object','object','object'],cover:0,tested:false,published:false,blankAdded:false,dialogue:null};}
function readSave(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.version===1&&Number.isInteger(s.chapter)&&s.chapter>=0&&s.chapter<=3&&Array.isArray(s.facts)&&Array.isArray(s.headlines))return {...fresh(),...s,screen:'landing',selectedClue:null};}catch{}return fresh();}
let state=readSave();
let toastTimer;
let audioContext;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sound(kind='paper'){
  if(!state.sound)return;
  try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const o=audioContext.createOscillator(),g=audioContext.createGain();o.connect(g);g.connect(audioContext.destination);o.type=kind==='stamp'?'triangle':'sine';o.frequency.setValueAtTime(kind==='stamp'?110:430,audioContext.currentTime);g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.09);o.start();o.stop(audioContext.currentTime+.1);}catch{}
}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4400);}
function say(person,text){state.dialogue={person,text};}
function has(f){return state.facts.includes(f);}
function addFact(f){if(!has(f))state.facts.push(f);}
function topbar(){return `<header class="topbar"><div class="brand"><span class="brand-icon" aria-hidden="true"></span>未完成的图鉴</div><div class="top-meta">工业记忆馆 / 档案审阅台</div><nav class="utility" aria-label="游戏工具"><span class="save-dot">本机自动保存</span><button data-action="rules">审阅须知</button><button data-action="sound" aria-label="${state.sound?'关闭':'开启'}音效">音效 ${state.sound?'开':'关'}</button><button data-action="home">目录</button></nav></header>`;}
function footer(){return `<footer class="footer"><span>工业记忆馆 · 访问者 林见</span><span class="dots">● 文字有据　○ 空白有待</span><span>虚构档案 / 四幕试玩版</span></footer>`;}
function render(){save();if(state.screen==='landing')renderLanding();else if(state.screen==='ending')renderEnding();else renderGame();}
function renderLanding(){app.innerHTML=`<main class="landing">${topbar()}<div class="landing-content"><div class="eyebrow">THE UNFINISHED ATLAS / VOL. 01</div><h1>未完成的<br>图鉴</h1><div class="subtitle">请核对这段记忆</div><p class="intro">明早，工业记忆馆就要开放。<br>三份档案，一张桌子。<br>有些事可以写下，有些事还要再问。</p><button class="primary" data-action="start">${state.started?'继续审阅':'坐到档案桌前'} <span aria-hidden="true"> →</span></button>${state.started?'<button class="secondary" data-action="restart">重新开始</button>':''}<div class="edition">4 幕故事 · 点击操作 · 约 15 分钟</div><div class="cover-paper" aria-hidden="true"><div class="folio">ARCHIVE / 001 — 003</div><h2>工业<br>记忆图鉴</h2><div class="cover-mark">待　审</div><small>物件之外，还有人的经历。</small></div></div><footer class="landing-footer"><span>一场关于物件、记忆与留白的桌面调查</span><span>像素叙事游戏 · DEMO 01</span></footer></main>`;}
function chapterbar(){return `<div class="chapterbar"><div class="chapter-heading"><div class="chapter-number">0${state.chapter+1}</div><div><h1>${chapters[state.chapter].title}</h1><p>${chapters[state.chapter].subtitle}</p></div></div><div class="chapter-progress" aria-label="章节进度">${chapters.map((c,i)=>`<div class="chapter-step ${i===state.chapter?'active':state.completed.includes(i)?'done':''}"><span>${state.completed.includes(i)?'✓':i+1}</span><div class="step-label">${c.short}</div></div>`).join('')}</div></div>`;}
function scene(){const c=chapters[state.chapter],d=state.dialogue||{person:c.person,text:c.intro},p=characters[d.person];return `<section class="scene" aria-label="人物对话"><div class="room-label">记忆馆 · 同一张档案桌</div><div class="portrait ${p.role.includes('重构')?'reconstruction':''}" style="background-position:${p.pos}" role="img" aria-label="${p.name}的像素立绘"></div><div class="dialogue"><div class="speaker">${p.name}<small>${p.role}</small></div><p class="speech" aria-live="polite">${d.text}</p><div class="dialogue-foot"><span>${p.role.includes('重构')?'● 档案支持的重构片段':'● 现场交谈'}</span>${state.chapter<3?'<button data-action="ask">询问当前疑问 →</button>':'<span>公开呈现 · 最后一页</span>'}</div></div></section>`;}
function locked(id){return (['inspection','receipt'].includes(id)&&!has('scope'))||(id==='followup'&&!has('conflict'));}
const docTitles={factory:'车间照片',samples:'样件用途卡',process:'加工记录',draft1:'图鉴旧稿',inspection:'检验记录',receipt:'接收记录',family:'家庭合照',repair:'维修单',oral:'两份口述',letter:'私人信封',draft2:'图鉴旧稿',original:'消息原稿',received:'接收抄件',action:'拟办便条',followup:'回问记录',draft3:'图鉴旧稿'};
function clue(key,text){const pair=pairs.find(p=>p.chapter===state.chapter&&p.keys.includes(key)&&has(p.fact));return `<button class="clue ${state.selectedClue===key?'chosen':''} ${pair?'matched':''}" data-clue="${key}" aria-pressed="${state.selectedClue===key}">${text}</button>`;}
function paperHeader(id,label){return `<div class="paper-top"><span>${label}</span><span>${String(chapters[state.chapter].docs.indexOf(id)+1).padStart(2,'0')}</span></div>`;}
function docBody(id){
  switch(id){
    case 'factory':return `<h2>照片外面有什么</h2><div class="photo workshop" role="img" aria-label="机器旁的工人，右侧边缘有一只伸出的手"></div><button class="flip" data-action="flip">${state.flipped?'看正面 ↺':'翻到背面 ↻'}</button>${state.flipped?`<p class="document-quote">${clue('photo-pending','加工完成，待交。')}</p><p class="fine">纸角有折痕，未附后续去向。</p>`:`<p>加工设备占据画面。照片边缘，一只手正伸向工作台。</p><button class="clue" data-action="hand">查看照片边缘的手</button>`}`;
    case 'samples':return `<h2>两件相似的样件</h2><p class="subline">用途卡 / 本次档案</p><div class="record-row"><span>对象 A</span>${clue('sample-a','演示留样')}</div><div class="record-row"><span>对象 B</span><strong>交下一岗位</strong></div><hr class="paper-rule"><p>外形相近，不代表去向相同。</p><p class="fine">请与图鉴旧稿核对。本卡为虚构演示文书，不代表真实工艺标准。</p>`;
    case 'process':return `<h2>当前加工记录</h2><div class="record-row"><span>样件 A</span><strong>当前加工完成</strong></div><div class="record-row"><span>样件 B</span><strong>当前加工完成</strong></div><div class="record-row"><span>确认人</span><strong>周师傅</strong></div><p class="document-quote">“我说做完了，是我这一步做完了。”</p><p class="fine">本记录不代替检验与接收记录。</p>`;
    case 'draft1':return `<h2>一份写得太满的说明</h2><p class="subline">展示初稿 / 尚未审核</p><p class="document-quote">加工完成后，${clue('draft-both','两件样件')}${clue('draft-direct','直接交往下一岗位')}。</p><hr class="paper-rule"><p class="fine">点击带虚线的文字，再选择另一份材料中的相关文字进行对照。</p><p class="fine">核对重点：对象用途、确认范围。</p>`;
    case 'inspection':return `<h2>检验记录复本</h2><div class="record-row"><span>对象标识</span><strong>B</strong></div><div class="record-row"><span>检验状态</span><strong>对应检验已完成</strong></div><div class="record-row"><span>确认人</span><strong>阿唐</strong></div><div class="record-row"><span>接收栏</span><strong>未填写</strong></div><p class="fine">检验完成之后，是否发生交接，需要查看接收记录。</p>`;
    case 'receipt':return `<h2>有人接过这份记录</h2><div class="record-row"><span>对象标识</span><strong>B</strong></div><div class="record-row"><span>接收人</span><strong>顾</strong></div><div class="record-row"><span>确认范围</span><strong>本次交接</strong></div><div class="record-row"><span>后续去向</span><strong>本档案未附</strong></div><p class="document-quote">“我接的是这一段。再后面的，得看别人的记录。”</p><div class="found-note">记录中的接收者已确认。照片里真实人物的身份仍需另查。</div>`;
    case 'family':return `<h2>电视前的一个晚上</h2><div class="photo family" role="img" aria-label="一家人围坐在电视前的虚构像素合照"></div><p>照片背面：${clue('photo-date','1 月 12 日')}</p><p class="fine">与维修单为同一年。照片只记录了这一个晚上。</p>`;
    case 'repair':return `<h2>电视维修记录</h2><div class="record-row"><span>报修</span>${clue('repair-date','1 月 20 日')}</div><div class="record-row"><span>修复</span><strong>1 月 27 日</strong></div><div class="record-row"><span>姓名</span><button class="redact ${state.redacted.includes('name')?'hidden':''}" data-redact="name">${state.redacted.includes('name')?'已遮名':'陈女士'}</button></div><div class="record-row"><span>地址</span><button class="redact ${state.redacted.includes('address')?'hidden':''}" data-redact="address">${state.redacted.includes('address')?'已遮蔽':'虚构里 12 号'}</button></div><p class="fine">公开前，请点击两处私人信息遮蔽。文书姓名、地址均为虚构演示内容。</p>`;
    case 'oral':return `<h2>同一件物，两种记忆</h2><p class="subline">口述整理 / 需结合其他材料</p><p><strong>小陈</strong></p><p>“我记得那年冬天，大家总聚在一起看电视。”</p><hr class="paper-rule"><p><strong>陈阿姨</strong></p><p>“我最记得那次坏了，等了好些天。”</p><p class="fine">记得不同的事，不等于有人说谎。</p>`;
    case 'letter':return `<h2>私人信封</h2><div class="envelope" aria-label="封闭的私人信件"><span>暂不公开</span></div><p>“这封先别放。照片可以，维修单也可以，把姓名和地址遮掉。”</p><p class="fine">本次没有阅读或公开授权。信封保持封闭，请在图鉴审核栏标记处理范围。</p>`;
    case 'draft2':return `<h2>照片没说的那些事</h2><p class="subline">展示初稿 / 尚未审核</p><p class="document-quote">这台电视让一家人${clue('draft-every','每晚都快乐地聚在一起')}。</p><hr class="paper-rule"><p class="fine">一张合照，能代表每一个晚上吗？请与照片上的日期对照。</p>`;
    case 'original':return `<h2>消息原稿</h2><p class="subline">发出端 / 记录复本</p><p class="document-quote">${clue('original-message','先保存这批材料，等我来核对。')}</p><div class="photo message" role="img" aria-label="电报工具和消息纸的像素插画"></div><p class="fine">核对原稿、抄件和拟办内容。</p>`;
    case 'received':return `<h2>接收抄件</h2><p class="subline">接收端 / 记录复本</p><p class="document-quote">${clue('received-message','先保存这批材料，等我来核对。')}</p><hr class="paper-rule"><div class="record-row"><span>送达状态</span><strong>已收到</strong></div><p class="fine">收到文字，不等于理解无误，也不能证明后续行动。</p>`;
    case 'action':return `<h2>接收者的拟办便条</h2><p class="subline">拟办 / 非执行结果</p><p class="document-quote">他要来核对，${clue('action-clear','先清掉不用的材料')}。</p><hr class="paper-rule"><p>这是准备采取的行动。未附实际处置记录。</p><p class="fine">对照原稿，判断拟办内容是否符合原要求。</p>`;
    case 'followup':return `<h2>后来，又问了一次</h2><p class="document-quote">已就保存范围再次询问。</p><div class="record-row"><span>最终处置记录</span><strong>缺失</strong></div><p>档案袋里没有更多附件。</p><div class="found-note">可以确认发生过回问。无法确认这批材料最后是否保存。</div>`;
    case 'draft3':return `<h2>送达以后的事</h2><p class="subline">展示初稿 / 尚未审核</p><p class="document-quote">消息准确送达，材料因此得到了保存。</p><hr class="paper-rule"><p class="fine">前半句和后半句，需要不同的材料支持。缺失的结果应保留为待核。</p>`;
    default:return '';
  }
}
function paper(id){if(!id)return `<article class="paper empty"><div class="plus">＋</div><strong>打开另一份材料</strong><p>从左侧档案袋选择文书。两份材料可以并排查看。</p></article>`;return `<article class="paper" data-doc="${id}">${paperHeader(id,'MEMORY ARCHIVE')}${docBody(id)}</article>`;}
function renderGame(){app.innerHTML=`<main class="game">${topbar()}${chapterbar()}${scene()}${state.chapter===3?editor():desk()}${footer()}</main>`;}
function desk(){const c=chapters[state.chapter];return `<section class="desk" aria-label="档案工作桌"><div class="desk-grid"><aside class="case-folder"><div class="section-label">档案袋 <small>${c.docs.filter(d=>!locked(d)).length} 份</small></div><div class="file-list">${c.docs.map((id,i)=>`<button class="file-tab ${state.visible.includes(id)?'selected':''} ${locked(id)?'locked':''}" data-doc-open="${id}" ${locked(id)?'disabled':''}><span class="file-no">${String(i+1).padStart(2,'0')}</span>${locked(id)?'尚未找到':docTitles[id]}${state.read.includes(id)?'<span class="read-mark">✓</span>':''}</button>`).join('')}</div><p class="folder-note">点击文书并排查看。<br>点击两处虚线文字，<br>核对它们的关系。</p></aside><div class="workbench"><div class="section-label">文书对照区 <small>点击查看 · 无需拖拽</small></div><div class="paper-spread">${paper(state.visible[0])}${paper(state.visible[1])}</div></div><aside><div class="section-label">本幕图鉴 <small>0${state.chapter+1} / 03</small></div><div class="draft-sheet"><h2>审阅记录</h2><p class="draft-sub">先核对材料，再选择条目盖章。</p>${c.claims.map((cl,i)=>`<button class="claim ${state.activeClaim===i?'active':''}" data-claim="${i}" aria-pressed="${state.activeClaim===i}"><span class="claim-id">0${i+1}</span><span class="claim-text">${cl.text}</span><span class="claim-status ${state.stamps[cl.id]?'stamped '+state.stamps[cl.id]:''}">${state.stamps[cl.id]?labels[state.stamps[cl.id]]:state.activeClaim===i?'↓ 请选择下方印章':'点击此条目'}</span></button>`).join('')}<div class="stamp-tray" aria-label="选择印章"><button class="stamp" data-stamp="include">收录</button><button class="stamp pending" data-stamp="pending">待核</button><button class="stamp private" data-stamp="private">不公开</button></div><button class="submit" data-action="submit">提交本幕审阅 →</button><p class="draft-tip">可以修改印章。未知的结果也可以留在图鉴里。</p></div></aside></div><div class="toolbar"><div class="compare-hint"><span class="tiny-icon" aria-hidden="true">⌕</span><span>${state.selectedClue?'已选中一处线索。请打开相关文书，点击第二处虚线文字。':'从两份文书中，各选择一处虚线文字进行对照。'}</span></div><div class="tool-actions"><button data-action="cancel-compare">取消对照</button><button data-action="hint">给我一点提示</button></div></div></section>`;}
function editor(){return `<section class="editor-desk" aria-label="图鉴编排"><div class="section-label">首批展示页 <small>点击选入口，再选择首页</small></div><div class="editor-layout"><div class="editor-pages">${pageData.map((p,i)=>`<article class="editor-card ${state.cover===i?'is-cover':''}"><div class="paper-top"><span>第 ${i+1} 页 / 已审核</span><span>${state.cover===i?'首页':'附页'}</span></div><div class="photo ${p.photo}" role="img" aria-label="${p.title}"></div><h2>${p.title}</h2><button class="entry-option ${state.headlines[i]==='object'?'active':''}" data-entry="${i}:object" aria-pressed="${state.headlines[i]==='object'}">${p.object}</button><button class="entry-option ${state.headlines[i]==='question'?'active':''}" data-entry="${i}:question" aria-pressed="${state.headlines[i]==='question'}">${p.question}</button><p>附件：${p.attachment}</p><button class="cover-button" data-cover="${i}">${state.cover===i?'✓ 已设为图鉴首页':'设为图鉴首页 →'}</button></article>`).join('')}</div><aside class="editor-side"><h2>让读者先看什么</h2><p>每页选一句入口。<br>研究材料会留在附件里，已经核对的事实不变。</p><button class="secondary" data-action="test-read">${state.tested?'再次试读':'请一位读者试读'}</button><button class="primary" data-action="publish" ${state.tested?'':'disabled'}>盖章发布 →</button><div class="editor-note">${state.tested?'已完成试读。可以按现在的版本发布，也可以调整后再次试读。':'先试读，再发布。不同入口会引出不同的问题，没有唯一正确的编排。'}</div></aside></div></section>`;}
function renderEnding(){const p=pageData[state.cover],q=state.headlines[state.cover]==='question';app.innerHTML=`<main class="end-screen">${topbar()}<div class="end-content"><div class="eyebrow">THE MUSEUM IS OPEN / 开放日</div><h1>${state.blankAdded?'图鉴，仍然打开。':'还有一个问题。'}</h1><p class="ending-copy">${state.blankAdded?'你留下了三页有依据的记录，也留下了可以继续追问的空白。<br>后来的人，从这里开始。':`第一位读者翻开图鉴。<br>“${q?p.readerQuestion:p.readerObject}”<br><br>林见：“有些事已经写清，有些还要再去问。”`}</p>${state.blankAdded?`<div class="end-artifacts">${[state.cover,...[0,1,2].filter(i=>i!==state.cover)].map(i=>`<article class="paper"><div class="paper-top"><span>${i===state.cover?'首页':'图鉴附页'}</span><span>已收录</span></div><div class="photo ${pageData[i].photo}" role="img" aria-label="${pageData[i].title}"></div><h2>${pageData[i][state.headlines[i]]}</h2><p>${pageData[i].summary}</p></article>`).join('')}</div><p class="ending-copy">留给下一位访问者的问题：${p.blank}</p><div class="end-actions"><button class="primary" data-action="view-atlas">查看我的图鉴</button><button class="secondary" data-action="restart">重新审阅</button></div>`:`<button class="blank-card" data-action="add-blank"><small>最后一张记录卡</small><br>${p.blank}<br><small>点击，将这张空白卡夹进图鉴 →</small></button>`}</div>${footer()}</main>`;}
function showModal(title,html,buttons=[{text:'知道了',action:'close-modal'}]){modal.innerHTML=`<div class="eyebrow">MEMORY ARCHIVE</div><h2 id="modal-title">${title}</h2>${html}<div class="modal-actions">${buttons.map((b,i)=>`<button class="${i===buttons.length-1?'primary':'secondary'}" data-action="${b.action}">${b.text}</button>`).join('')}</div>`;if(!modal.open)modal.showModal();}
function start(){state.started=true;state.screen=state.published?'ending':'game';state.visible.forEach(id=>{if(!state.read.includes(id))state.read.push(id);});render();}
function openDoc(id){if(locked(id))return;if(state.visible.includes(id)){toast('这份材料已经放在桌面上。');return;}state.visible=[state.visible[1],id].filter(Boolean);if(!state.read.includes(id))state.read.push(id);if(id==='receipt'){addFact('received');say('wen','这份接收记录确认 B 已完成本次交接。后续去向没有附在袋里，仍要待查。');}if(id==='followup'){addFact('unknown');say('wen','能确认发生过回问，不能确认最终保存。这里可以留一个问题。');}sound();render();}
function selectClue(key){sound();if(!state.selectedClue){state.selectedClue=key;render();return;}if(state.selectedClue===key){state.selectedClue=null;render();return;}const pair=pairs.find(p=>p.chapter===state.chapter&&p.keys.includes(key)&&p.keys.includes(state.selectedClue));state.selectedClue=null;if(pair){addFact(pair.fact);say(pair.person,pair.speech);render();toast(pair.message);}else{render();toast('这两处还不能支持同一个结论。试着核对用途、日期或行动要求。');}}
function hint(){
  let message='';
  if(state.chapter===0){if(!has('purpose'))message='打开“样件用途卡”和“图鉴旧稿”，分别点击“演示留样”和“两件样件”。';else if(!has('scope'))message='打开车间照片，翻到背面。将“加工完成，待交”与旧稿中的“直接交往下一岗位”对照。';else if(!has('received'))message='新的接收记录已经放进档案袋，打开查看它确认的范围。';else message='A 留样、B 本次交接都有依据。B 之后的去向仍待核。选择条目，再点印章。';}
  if(state.chapter===1){if(!has('dates'))message='对照家庭合照的 1 月 12 日和维修单的 1 月 20 日，确认是否为同一天。';else if(!has('general'))message='对照图鉴旧稿中的“每晚”与合照上的单日日期。';else if(state.redacted.length<2)message='打开维修单，点击姓名与地址，把两处私人信息都遮掉。';else message='家庭经历与匿名维修单可以收录。私人信件标为“不公开”。';}
  if(state.chapter===2){if(!has('identical'))message='依次点击消息原稿、接收抄件中的完整消息，核对文字。';else if(!has('conflict'))message='把原稿的“先保存”与拟办便条的“先清掉”对照。';else if(!has('unknown'))message='打开新出现的回问记录，查看有没有最终处置结果。';else message='文字一致、发生误解和回问都有记录。材料最终得到保存这一结论，只能标为“待核”。';}
  toast(message);
}
function submit(){const c=chapters[state.chapter];const missing=c.facts.find(f=>!has(f));if(missing){say('wen','先把这次判断的依据找齐。你可以查看提示，继续核对桌上的材料。');render();hint();return;}if(state.chapter===1&&state.redacted.length<2){say('chen','照片可以放，维修单也可以。只是这上面的姓名和地址，请先遮掉。');render();toast('维修单还有私人信息未遮蔽。');return;}const wrong=c.claims.find(cl=>state.stamps[cl.id]!==cl.answer);if(wrong){state.activeClaim=c.claims.indexOf(wrong);render();toast(!state.stamps[wrong.id]?'还有条目没有处理。选中条目，再选择印章。':wrong.answer==='pending'?'现有资料不能确认这一结果。请保留为“待核”。':wrong.answer==='private'?'材料提供者尚未授权。请标记“不公开”。':'这一条已有支持材料，并在公开范围内，可以收录。');return;}if(!state.completed.includes(state.chapter))state.completed.push(state.chapter);save();sound('stamp');showModal('这一页，留下了依据。',`<div class="success-mark" aria-hidden="true">✓</div><p>${c.end}</p><p>已保存到图鉴。下一幕仍在这张桌前继续。</p>`,[{text:state.chapter===2?'开始编排图鉴 →':'打开下一份档案 →',action:'next-chapter'}]);}
function ask(){const c=state.chapter;if(c===0){say('zhou',has('scope')?'加工是我负责，检验看阿唐的记录，交接找接收者。不能把一个人的“完成”写成所有人的完成。':'两件外形差不多，用途却不同。你把用途卡和那份旧稿放在一起看看。');}if(c===1){say('chen','我和小陈记得的不是同一件事。照片和去掉姓名、地址的维修单可以公开，那封信先别放。');}if(c===2){say('clerk','我只能确认我处理过的消息。收到的人怎么理解，后来有没有照办，要分别看他们的记录。');}render();}
function nextChapter(){modal.close();state.chapter=Math.min(3,state.chapter+1);state.visible=chapters[state.chapter].initial?[...chapters[state.chapter].initial]:[];state.visible.forEach(id=>{if(!state.read.includes(id))state.read.push(id);});state.activeClaim=0;state.selectedClue=null;state.dialogue=null;state.flipped=false;render();window.scrollTo({top:0});}
function testRead(){const p=pageData[state.cover],text=state.headlines[state.cover]==='question'?p.readerQuestion:p.readerObject;state.tested=true;say('reader',text);render();toast('试读完成。你可以直接发布，也可以调整入口后重新试读。');}
function publish(){if(!state.tested)return;state.published=true;state.screen='ending';state.completed=[0,1,2,3];sound('stamp');render();window.scrollTo({top:0});}
function onAction(action){switch(action){
  case 'start':start();break;
  case 'home':state.screen='landing';render();break;
  case 'rules':showModal('档案桌上的四件事',`<ol><li>从档案袋点击文书，两份材料可以并排查看。</li><li>点击两处带虚线的文字，发现关系或不一致之处。</li><li>选择右侧的图鉴条目，盖“收录”“待核”或“不公开”。</li><li>提交本幕，最后为三页图鉴选择阅读入口。</li></ol><p>没有倒计时，也不需要拖拽。错误可以修正，进度自动保存在当前浏览器。所有人物与文书均为虚构演示素材。</p>`);break;
  case 'sound':state.sound=!state.sound;sound();render();break;
  case 'close-modal':modal.close();break;
  case 'restart':showModal('重新整理这张桌子？','<p>将清除当前浏览器中的试玩进度，从第一份车间档案重新开始。</p>',[{text:'保留进度',action:'close-modal'},{text:'重新开始',action:'confirm-restart'}]);break;
  case 'confirm-restart':modal.close();state=fresh();start();window.scrollTo({top:0});break;
  case 'flip':state.flipped=!state.flipped;sound();render();break;
  case 'hand':say('wen',has('scope')?'接收记录已经找到。你可以查看它，但照片中真实人物的身份仍需另查。':'这只手在等什么？照片背面的“待交”，也许可以和旧稿里的结论对照。');render();break;
  case 'cancel-compare':state.selectedClue=null;render();toast('已取消本次对照。');break;
  case 'hint':hint();break;
  case 'submit':submit();break;
  case 'ask':ask();break;
  case 'next-chapter':nextChapter();break;
  case 'test-read':testRead();break;
  case 'publish':publish();break;
  case 'add-blank':state.blankAdded=true;sound();render();break;
  case 'view-atlas':showModal('你的图鉴',pageData.map((p,i)=>`<p><strong>${i+1}. ${p[state.headlines[i]]}</strong><br>${p.summary}<br><small>附件：${p.attachment}</small></p>`).join('')+`<p>未决问题：${pageData[state.cover].blank}</p>`);break;
}}
document.addEventListener('click',event=>{const el=event.target.closest('button');if(!el||el.disabled)return;
  if(el.dataset.action){onAction(el.dataset.action);return;}
  if(el.dataset.docOpen){openDoc(el.dataset.docOpen);return;}
  if(el.dataset.clue){selectClue(el.dataset.clue);return;}
  if(el.dataset.claim!==undefined){state.activeClaim=Number(el.dataset.claim);render();return;}
  if(el.dataset.stamp){const c=chapters[state.chapter].claims[state.activeClaim];state.stamps[c.id]=el.dataset.stamp;sound('stamp');render();return;}
  if(el.dataset.redact){if(!state.redacted.includes(el.dataset.redact)){state.redacted.push(el.dataset.redact);sound();render();toast('私人信息已遮蔽。');}return;}
  if(el.dataset.entry){const [idx,kind]=el.dataset.entry.split(':');state.headlines[Number(idx)]=kind;state.tested=false;state.dialogue=null;sound();render();return;}
  if(el.dataset.cover!==undefined){state.cover=Number(el.dataset.cover);state.tested=false;state.dialogue=null;render();return;}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!modal.open&&state.selectedClue){state.selectedClue=null;render();}});
render();
