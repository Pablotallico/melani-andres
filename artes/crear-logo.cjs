const fs = require('fs');
const path = require('path');
const runtime = 'C:/Users/Pablo Vasquez/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {createCanvas, GlobalFonts, SvgExportFlag} = require(runtime + '@napi-rs/canvas');
GlobalFonts.registerFromPath(path.join(__dirname, 'Parisienne-Regular.ttf'), 'Parisienne');
function draw(ctx, color, bg) {
  if(bg) {ctx.fillStyle=bg; ctx.fillRect(0,0,1600,1000);}
  ctx.fillStyle=color;
  ctx.font='350px Parisienne';
  const m=ctx.measureText('A&M');
  const x=(1600-m.actualBoundingBoxLeft-m.actualBoundingBoxRight)/2+m.actualBoundingBoxLeft;
  const y=(1000+m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2;
  ctx.fillText('A&M',x,y);
}
for(const [name,color,bg] of [['oliva','#6E7F62',null],['carob','#725C3A',null],['almendra','#E5E0D8',null],['negro','#000000',null],['principal','#6E7F62','#E5E0D8']]) {
  const svg=createCanvas(1600,1000,SvgExportFlag.ConvertTextToPaths);
  draw(svg.getContext('2d'),color,bg);
  fs.writeFileSync(path.join(__dirname,`AM-${name}.svg`),svg.getContent());
  const png=createCanvas(3200,2000); const ctx=png.getContext('2d');ctx.scale(2,2);draw(ctx,color,bg);
  fs.writeFileSync(path.join(__dirname,`AM-${name}.png`),png.toBuffer('image/png'));
}
const preview=createCanvas(1600,1000), c=preview.getContext('2d');draw(c,'#6E7F62','#E5E0D8');
fs.writeFileSync(path.join(__dirname,'vista-previa.png'),preview.toBuffer('image/png'));
