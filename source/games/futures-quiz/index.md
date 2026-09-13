---
layout: post
title: 期货竞答游戏
---

<div id="quiz-container" style="max-width:800px;margin:auto;padding:20px;border:1px solid #ccc;border-radius:8px;background:#fafafa;">
  <h2>期货知识竞答</h2>
  <div id="question"></div>
  <div id="options"></div>
  <button id="submit" style="margin-top:10px;display:none;">提交答案</button>
  <div id="feedback" style="margin-top:10px;font-weight:bold;"></div>
  <button id="next" style="margin-top:10px;display:none;">下一题</button>
</div>

<script>
async function loadQuestions(){
  const resp = await fetch('/games/futures-quiz/assets/questions.json');
  const data = await resp.json();
  return data;
}
let questions=[];let idx=0;let current=null;
function renderQuestion(){
  const q = current;
  document.getElementById('question').innerHTML = `<p><strong>${q.type=== 'prediction' ? '预测题' : (q.type==='truefalse'?'判断题':'题目')}：</strong> ${q.question}</p>`;
  const optsDiv = document.getElementById('options');
  optsDiv.innerHTML='';
  if(q.type==='prediction'){
    optsDiv.innerHTML = `<input type="text" id="answer" placeholder="输入品种代码，例如: RU" style="width:100%;padding:5px;"/>`;
  }else if(q.type==='truefalse'){
    optsDiv.innerHTML = `<label><input type="radio" name="opt" value="True"/> 对</label> <label style="margin-left:10px;"><input type="radio" name="opt" value="False"/> 错</label>`;
  }else{
    q.options.forEach((o,i)=>{
      optsDiv.innerHTML += `<label><input type="checkbox" name="opt" value="${i}"/> ${o}</label><br/>`;
    });
  }
  document.getElementById('submit').style.display='inline-block';
  document.getElementById('feedback').innerHTML='';
  document.getElementById('next').style.display='none';
}
function checkAnswer(){
  let correct=false;
  if(current.type==='prediction'){
    const ans = document.getElementById('answer').value.trim();
    correct = ans.toUpperCase()===current.answer.toUpperCase();
  }else if(current.type==='truefalse'){
    const sel = document.querySelector('input[name="opt"]:checked');
    if(!sel){alert('请选择答案');return;}
    correct = sel.value===String(current.answer);
  }else{ // multiple choice
    const checked = Array.from(document.querySelectorAll('input[name="opt"]:checked')).map(e=>parseInt(e.value));
    const sorted = a=>a.slice().sort((x,y)=>x-y).join(',');
    correct = sorted(checked)===sorted(current.answer);
  }
  document.getElementById('feedback').innerHTML = correct ? '✅ 正确！' : `❌ 错误，正确答案: ${Array.isArray(current.answer)?current.answer.map(i=>current.options[i]).join(', '):current.options[current.answer]}`;
  document.getElementById('submit').style.display='none';
  document.getElementById('next').style.display='inline-block';
}
function next(){
  idx = (idx+1)%questions.length;
  current = questions[idx];
  renderQuestion();
}
document.getElementById('submit').addEventListener('click',checkAnswer);
document.getElementById('next').addEventListener('click',next);
loadQuestions().then(qs=>{questions=qs; current=questions[0]; renderQuestion();});
</script>
