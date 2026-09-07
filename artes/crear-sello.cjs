const fs=require('fs'), path=require('path');
const {createCanvas,GlobalFonts,SvgExportFlag}=require('C:/Users/Pablo Vasquez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
GlobalFonts.registerFromPath(path.join(__dirname,'Parisienne-Regular.ttf'),'Parisienne');
function letter(c,text,size,x,y){
 c.font=`${size}px Parisienne`;
 const m=c.measureText(text);
 c.lineWidth=3.5;c.lineJoin='round';
 c.strokeText(text,x+m.actualBoundingBoxLeft,y+m.actualBoundingBoxAscent);
 c.fillText(text,x+m.actualBoundingBoxLeft,y+m.actualBoundingBoxAscent);
}
function draw(c,ink,bg,ring=true){
 if(bg){c.fillStyle=bg;c.fillRect(0,0,1200,1200);}
 c.fillStyle=ink;c.strokeStyle=ink;
 if(ring){c.lineWidth=9;c.beginPath();c.arc(600,600,465,0,Math.PI*2);c.stroke();}
 letter(c,'M',290,210,425);
 letter(c,'&',150,540,520);
 letter(c,'A',290,640,425);
}
for(const [name,ink,bg,ring] of [['oliva','#6E7F62',null,true],['negro','#000000',null,true],['almendra','#E5E0D8',null,true],['principal','#6E7F62','#E5E0D8',true],['sin-aro','#6E7F62',null,false]]){
 const v=createCanvas(1200,1200,SvgExportFlag.ConvertTextToPaths);draw(v.getContext('2d'),ink,bg,ring);fs.writeFileSync(path.join(__dirname,`MA-sello-${name}.svg`),v.getContent());
 const p=createCanvas(3000,3000),c=p.getContext('2d');c.scale(2.5,2.5);draw(c,ink,bg,ring);fs.writeFileSync(path.join(__dirname,`MA-sello-${name}.png`),p.toBuffer('image/png'));
}
const p=createCanvas(1000,1000),c=p.getContext('2d');c.scale(1000/1200,1000/1200);draw(c,'#6E7F62','#E5E0D8');fs.writeFileSync(path.join(__dirname,'vista-previa-MA.png'),p.toBuffer('image/png'));
