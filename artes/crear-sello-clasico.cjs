const fs=require('fs'),path=require('path');
const {createCanvas,GlobalFonts,SvgExportFlag}=require('C:/Users/Pablo Vasquez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
GlobalFonts.registerFromPath('C:/Windows/Fonts/times.ttf','Sello Serif');
function draw(c,color,mono=false){
 c.fillStyle=color;
 if(!mono){c.beginPath();c.arc(600,600,480,0,Math.PI*2);c.fill();}
 c.strokeStyle=mono?color:'#E5D2BE';c.lineWidth=2.5;c.setLineDash([10,9]);
 c.beginPath();c.arc(600,600,411,0,Math.PI*2);c.stroke();c.setLineDash([]);
 c.fillStyle=mono?color:'#F3EBDD';c.font='310px "Sello Serif"';
 const m=c.measureText('M&A');
 const x=(1200-m.actualBoundingBoxRight+m.actualBoundingBoxLeft)/2;
 const y=(1200+m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;
 c.fillText('M&A',x,y);
}
for(const [name,color,mono] of [['terracota','#984C3C',false],['oliva','#6E7F62',false],['negro','#000000',true]]){
 const v=createCanvas(1200,1200,SvgExportFlag.ConvertTextToPaths);draw(v.getContext('2d'),color,mono);fs.writeFileSync(path.join(__dirname,`MA-clasico-${name}.svg`),v.getContent());
 const p=createCanvas(3000,3000),c=p.getContext('2d');c.scale(2.5,2.5);draw(c,color,mono);fs.writeFileSync(path.join(__dirname,`MA-clasico-${name}.png`),p.toBuffer('image/png'));
}
const p=createCanvas(1000,1000),c=p.getContext('2d');
c.fillStyle='#F8F5EF';c.fillRect(0,0,1000,1000);c.scale(1000/1200,1000/1200);
c.save();c.shadowColor='#48281F55';c.shadowBlur=42;c.shadowOffsetY=25;c.fillStyle='#984C3C';c.beginPath();c.arc(600,600,480,0,Math.PI*2);c.fill();c.restore();draw(c,'#984C3C');
fs.writeFileSync(path.join(__dirname,'vista-previa-MA-clasico.png'),p.toBuffer('image/png'));
