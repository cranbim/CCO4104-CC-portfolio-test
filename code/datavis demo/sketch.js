// let d1=1
// let d2=30
// let d3=20
let d=[10,30,20,5,12,45,22,4,32,28]
let d2=[5,12,2,6,9,10,19,7,4,10]

let range
let multiplier

function setup() {
  createCanvas(400, 400);
  range=max(d)
  multiplier=300/range
  console.log(range)
}

function draw() {
  background(220);
  // circle(100,200,d1*5)
  // circle(200,200,d2*5)
  // circle(300,200,d3*5)
  let step=width/d.length
  line(0,300,width,300)
  for(let i=0; i<d.length; i++){
    // circle(i*step+step/2,300,d[i])
    line(i*step+step/2,300,i*step+step/2,300-d[i]*multiplier)
    circle(i*step+step/2,300-d[i]*multiplier,d2[i]*3)
    push()
    translate(i*step+step/2,300-d[i]*multiplier)
    rotate(PI/2)
    textAlign(LEFT,CENTER)
    text("data val: "+d[i],d2[i]*1.5+5,-10)
    pop()
  }
}