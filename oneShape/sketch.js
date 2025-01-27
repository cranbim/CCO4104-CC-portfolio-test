let tls=[]

function setup() {
  createCanvas(600, 600);
  for(let i=0; i<3; i++){
    tls.push(new TriangleLine(width/2, height/2, random(PI),500,30,50))
  }
  colorMode(HSB)
  // frameRate(1)
  describe('A continually drawing line made of triangles in one of two colours that reflect the orintation c/w the previous triangle');
}

function draw() {
  background(0,0,20);
  tls.forEach((tl)=>{
    tl.run()
    tl.add()
    tl.show()
  })
 
}

class TriangleLine{
  constructor(x,y,a,n,w,h){
    this.col0=random(30)+random(280)
    this.col1=this.col0+120
    this.ttl=200
    this.x=x
    this.y=y
    this.n=n
    this.c=n
    this.w=w
    this.h=h
    this.hyp=sqrt(this.h*this.h+ this.w*0.5*this.w*0.5)
    this.aSpan=atan2(w/2,h)*2
    console.log(degrees(this.aSpan))
    this.a=a
    // this.aShift=PI/2-(PI-this.aSpan)
    this.tris=[]
    this.or=0
  }
  
  show(){
    noStroke()
    let rel=0
    this.tris.forEach((tri,i)=>{
      rel=i/this.tris.length
      fill(tri.col,10+60*rel,30+50*rel)
      triangle(tri.v0.x, tri.v0.y,
               tri.v1.x, tri.v1.y,
               tri.v2.x, tri.v2.y,)
      // ellipse(tri.v9.x, tri.v9.y,5)
      tri.ttl--
    })
  }
  
  run(){
    this.w=noise(this.x/170+frameCount/170, this.y/170)*30
    this.h=noise(this.x/110+frameCount/110, this.y/110)*70
    this.hyp=sqrt(this.h*this.h+ this.w*0.5*this.w*0.5)
    this.aSpan=atan2(this.w/2,this.h)*2
  }
  
  add(){
    let aDelta=0
    let por=1
    if(this.tris.length>1){
      por=this.tris[this.tris.length-1]
    }
    por=this.or
    if(this.or==0){//this.or==0
      this.triUp(por,this.or)
      // this.or=1
    } else {
      this.triDown(por,this.or)
      // this.or=0
    }
    // this.or=floor(random(2))
    let rel=map(mouseX, 0, width, 4,20)
    this.or=floor(noise(this.x/rel,this.y/rel+frameCount/30)*2)
    if(this.or==por){
      if(this.or==0){
        aDelta=this.aSpan
      } else {
        aDelta=-this.aSpan
      }
    }
    this.a+=aDelta
    // console.log(this.or)
    // this.or=(this.or+1)%2
    this.x=(this.x+width)%width
    this.y=(this.y+height)%height
  }
  
  triUp(){
    // console.log('up')
    // triangle(this.x,this.y,
    //          this.x+this.w, this.y,
    //          this.x+this.w/2, this.y+this.h)
    this.tris.push({orn: this.or,
                    a: this.a,
                    v9:{x:this.x, y:this.y},
                    v0:{x: this.x+cos(this.a-PI/2)*this.h/2+                               cos(this.a-PI)*this.w/2,
                        y: this.y+sin(this.a-PI/2)*this.h/2+
                        sin(this.a-PI)*this.w/2},
                    v1:{x: this.x+cos(this.a-PI/2)*this.h/2+                               cos(this.a)*this.w/2,
                        y: this.y+sin(this.a-PI/2)*this.h/2+
                        sin(this.a)*this.w/2},
                    v2:{x: this.x+cos(this.a+PI/2)*this.h/2,
                        y: this.y+sin(this.a+PI/2)*this.h/2},
                    col:this.col1,
                    ttl:this.ttl
                   })
    
//     triangle(x+cos(a-PI/2)*h/2+cos(a-PI)*w/2, y+sin(a-PI/2)*h/2+sin(a-PI)*w/2,
//            x+cos(a-PI/2)*h/2+cos(a)*w/2, y+sin(a-PI/2)*h/2+sin(a)*w/2,
//            x+cos(a+PI/2)*h/2, y+sin(a+PI/2)*h/2
//            )
    
    this.x+=cos(this.a+this.aSpan/2)*this.w/2
    this.y+=sin(this.a+this.aSpan/2)*this.w/2
    // this.a+=this.aSpan/2
    if(this.tris.length>this.n){
      this.tris.shift()
    }
  }
  
  triDown(){
    // console.log('down')
    // triangle(this.x,this.y,
    //          this.x+this.w, this.y,
    //          this.x+this.w/2, this.y+this.h)
    // this.tris.push({orn: this.or,
    //                 a: this.a,
    //                 v0:{x: this.x, y: this.y},
    //                 v1:{x: this.x+this.w/2, y: this.y+this.h},
    //                 v2:{x: this.x-this.w/2, y: this.y+this.h}
    //                })
    // this.x+=0
    // this.y+=0
    // if(this.tris.length>this.n){
    //   this.tris.shift()
    // }
    
    this.tris.push({orn: this.or,
                    a: this.a,
                    v9:{x:this.x, y:this.y},
                     v2:{x: this.x+cos(this.a+PI/2)*this.h/2+                               cos(this.a-PI)*this.w/2,
                        y: this.y+sin(this.a+PI/2)*this.h/2+
                        sin(this.a-PI)*this.w/2},
                    v1:{x: this.x+cos(this.a+PI/2)*this.h/2+                               cos(this.a)*this.w/2,
                        y: this.y+sin(this.a+PI/2)*this.h/2+
                        sin(this.a)*this.w/2},
                    v0:{x: this.x+cos(this.a-PI/2)*this.h/2,
                        y: this.y+sin(this.a-PI/2)*this.h/2},
                    col:this.col0,
                    ttl:this.ttl
                   })
    
    this.x+=cos(this.a-this.aSpan/2)*this.w/2
    this.y+=sin(this.a-this.aSpan/2)*this.w/2
    // this.a-=this.aSpan/2
    if(this.tris.length>this.n){
      this.tris.shift()
    }
  }
  

}
