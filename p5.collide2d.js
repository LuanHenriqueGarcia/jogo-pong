


console.log("### p5.collide v0.7.3 ###")

p5.prototype._collideDebug = false;

p5.prototype.collideDebug = function(debugMode){
    _collideDebug = debugMode;
}


p5.prototype.collideRectRect = function (x, y, w, h, x2, y2, w2, h2) {
  
  if (x + w >= x2 &&    
      x <= x2 + w2 &&  
      y + h >= y2 &&    
      y <= y2 + h2) {  
        return true;
  }
  return false;
};

p5.prototype.collideRectRectVector = function(p1, sz, p2, sz2){
  return p5.prototype.collideRectRect(p1.x, p1.y, sz.x, sz.y, p2.x, p2.y, sz2.x,sz2.y)
}


p5.prototype.collideRectCircle = function (rx, ry, rw, rh, cx, cy, diameter) {

  var testX = cx;
  var testY = cy;

  if (cx < rx){         testX = rx      
  }else if (cx > rx+rw){ testX = rx+rw  }   
  if (cy < ry){         testY = ry       
  }else if (cy > ry+rh){ testY = ry+rh }  

  var distance = this.dist(cx,cy,testX,testY)

  if (distance <= diameter/2) {
    return true;
  }
  return false;
};

p5.prototype.collideRectCircleVector = function(r, sz, c, diameter){
  return p5.prototype.collideRectCircle(r.x,r.y, sz.x,sz.y, c.x,c.y, diameter)
}

p5.prototype.collideCircleCircle = function (x, y,d, x2, y2, d2) {

  if( this.dist(x,y,x2,y2) <= (d/2)+(d2/2) ){
    return true;
  }
  return false;
};


p5.prototype.collideCircleCircleVector = function(p1,d, p2, d2){
  return p5.prototype.collideCircleCircle(p1.x,p1.y,  d, p2.x,p2.y, d2)
}


p5.prototype.collidePointCircle = function (x, y, cx, cy, d) {
if( this.dist(x,y,cx,cy) <= d/2 ){
  return true;
}
return false;
};

p5.prototype.collidePointCircleVector = function(p, c, d){
  return p5.prototype.collidePointCircle(p.x,p.y,c.x,c.y,  d)
}

p5.prototype.collidePointEllipse = function (x, y, cx, cy, dx, dy) {
  var rx = dx/2, ry = dy/2;
  if (x > cx + rx || x < cx - rx ||y > cy + ry || y < cy - ry) {
		return false;
  }
  var xx = x - cx, yy = y - cy;
  var eyy = ry * this.sqrt(this.abs(rx * rx - xx * xx)) / rx;
  return yy <= eyy && yy >= -eyy;
};

p5.prototype.collidePointEllipseVector = function(p, c, d){
  return p5.prototype.collidePointEllipse(p.x,p.y,c.x,c.y,d.x,d.y);
}

p5.prototype.collidePointRect = function (pointX, pointY, x, y, xW, yW) {
if (pointX >= x &&         
    pointX <= x + xW &&    
    pointY >= y &&       
    pointY <= y + yW) {    
        return true;
}
return false;
};

p5.prototype.collidePointRectVector = function(point, p1, sz){
  return p5.prototype.collidePointRect(point.x, point.y, p1.x, p1.y, sz.x, sz.y);
}

p5.prototype.collidePointLine = function(px,py,x1,y1,x2,y2, buffer){
var d1 = this.dist(px,py, x1,y1);
var d2 = this.dist(px,py, x2,y2);

var lineLen = this.dist(x1,y1, x2,y2);

if (buffer === undefined){ buffer = 0.1; }   

if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
  return true;
}
return false;
}

p5.prototype.collidePointLineVector = function(point,p1,p2, buffer){
  return p5.prototype.collidePointLine(point.x,point.y, p1.x,p1.y, p2.x,p2.y, buffer);
}

p5.prototype.collideLineCircle = function( x1,  y1,  x2,  y2,  cx,  cy,  diameter) {
  var inside1 = this.collidePointCircle(x1,y1, cx,cy,diameter);
  var inside2 = this.collidePointCircle(x2,y2, cx,cy,diameter);
  if (inside1 || inside2) return true;

  var distX = x1 - x2;
  var distY = y1 - y2;
  var len = this.sqrt( (distX*distX) + (distY*distY) );

  var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / this.pow(len,2);

  var closestX = x1 + (dot * (x2-x1));
  var closestY = y1 + (dot * (y2-y1));


  var onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
  if (!onSegment) return false;

  if(this._collideDebug){
    this.ellipse(closestX, closestY,10,10);
  }

  distX = closestX - cx;
  distY = closestY - cy;
  var distance = this.sqrt( (distX*distX) + (distY*distY) );

  if (distance <= diameter/2) {
    return true;
  }
  return false;
}

p5.prototype.collideLineCircleVector = function( p1,  p2,  c,  diameter){
  return p5.prototype.collideLineCircle( p1.x,  p1.y,  p2.x,  p2.y,  c.x,  c.y,  diameter);
}
p5.prototype.collideLineLine = function(x1, y1, x2, y2, x3, y3, x4, y4,calcIntersection) {

  var intersection;

  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    if(this._collideDebug || calcIntersection){
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));
    }

    if(this._collideDebug){
      this.ellipse(intersectionX,intersectionY,10,10);
    }

    if(calcIntersection){
      intersection = {
        "x":intersectionX,
        "y":intersectionY
      }
      return intersection;
    }else{
      return true;
    }
  }
  if(calcIntersection){
    intersection = {
      "x":false,
      "y":false
    }
    return intersection;
  }
  return false;
}


p5.prototype.collideLineLineVector = function(p1, p2, p3, p4, calcIntersection){
  return p5.prototype.collideLineLine(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, calcIntersection);
}

p5.prototype.collideLineRect = function(x1, y1, x2, y2, rx, ry, rw, rh, calcIntersection) {

  var left, right, top, bottom, intersection;

  if(calcIntersection){
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,true);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,true);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,true);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,true);
     intersection = {
        "left" : left,
        "right" : right,
        "top" : top,
        "bottom" : bottom
    }
  }else{
     left =   this.collideLineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
     right =  this.collideLineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
     top =    this.collideLineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
     bottom = this.collideLineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);
  }

  if (left || right || top || bottom) {
    if(calcIntersection){
      return intersection;
    }
    return true;
  }
  return false;
}

p5.prototype.collideLineRectVector = function(p1, p2, r, rsz, calcIntersection){
  return p5.prototype.collideLineRect(p1.x, p1.y, p2.x, p2.y, r.x, r.y, rsz.x, rsz.y, calcIntersection);
}

p5.prototype.collidePointPoly = function(px, py, vertices) {
  var collision = false;

  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    next = current+1;
    if (next === vertices.length) next = 0;

    var vc = vertices[current];   
    var vn = vertices[next];       

    if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
         (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
            collision = !collision;
    }
  }
  return collision;
}

p5.prototype.collidePointPolyVector = function(p1, vertices){
  return p5.prototype.collidePointPoly(p1.x, p1.y, vertices);
}

p5.prototype.collideCirclePoly = function(cx, cy, diameter, vertices, interior) {

  if (interior === undefined){
    interior = false;
  }

  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    next = current+1;
    if (next === vertices.length) next = 0;

    var vc = vertices[current];    
    var vn = vertices[next];       
    var collision = this.collideLineCircle(vc.x,vc.y, vn.x,vn.y, cx,cy,diameter);
    if (collision) return true;
  }

  if(interior === true){
    var centerInside = this.collidePointPoly(cx,cy, vertices);
    if (centerInside) return true;
  }

  return false;
}

p5.prototype.collideCirclePolyVector = function(c, diameter, vertices, interior){
  return p5.prototype.collideCirclePoly(c.x, c.y, diameter, vertices, interior);
}

p5.prototype.collideRectPoly = function( rx, ry, rw, rh, vertices, interior) {
  if (interior == undefined){
    interior = false;
  }

  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    next = current+1;
    if (next === vertices.length) next = 0;

    var vc = vertices[current];    
    var vn = vertices[next];       

    var collision = this.collideLineRect(vc.x,vc.y,vn.x,vn.y, rx,ry,rw,rh);
    if (collision) return true;

    if(interior === true){
      var inside = this.collidePointPoly(rx,ry, vertices);
      if (inside) return true;
    }
  }

  return false;
}

p5.prototype.collideRectPolyVector = function(r, rsz, vertices, interior){
  return p5.prototype.collideRectPoly(r.x, r.y, rsz.x, rsz.y, vertices, interior);
}

p5.prototype.collideLinePoly = function(x1, y1, x2, y2, vertices) {

  var next = 0;
  for (var current=0; current<vertices.length; current++) {

    next = current+1;
    if (next === vertices.length) next = 0;

    var x3 = vertices[current].x;
    var y3 = vertices[current].y;
    var x4 = vertices[next].x;
    var y4 = vertices[next].y;

    var hit = this.collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4);
    if (hit) {
      return true;
    }
  }
  return false;
}


p5.prototype.collideLinePolyVector = function(p1, p2, vertice){
  return p5.prototype.collideLinePoly(p1.x, p1.y, p2.x, p2.y, vertice);
}

p5.prototype.collidePolyPoly = function(p1, p2, interior) {
  if (interior === undefined){
    interior = false;
  }

  var next = 0;
  for (var current=0; current<p1.length; current++) {

    next = current+1;
    if (next === p1.length) next = 0;

    var vc = p1[current];   
    var vn = p1[next];      

    var collision = this.collideLinePoly(vc.x,vc.y,vn.x,vn.y,p2);
    if (collision) return true;

    if(interior === true){
      collision = this.collidePointPoly(p2[0].x, p2[0].y, p1);
      if (collision) return true;
      collision = this.collidePointPoly(p1[0].x, p1[0].y, p2);
      if (collision) return true;
    }
  }

  return false;
}

p5.prototype.collidePolyPolyVector = function(p1, p2, interior) {
  return p5.prototype.collidePolyPoly(p1, p2, interior);
}

p5.prototype.collidePointTriangle = function(px, py, x1, y1, x2, y2, x3, y3) {

  var areaOrig = this.abs( (x2-x1)*(y3-y1) - (x3-x1)*(y2-y1) );

  var area1 =    this.abs( (x1-px)*(y2-py) - (x2-px)*(y1-py) );
  var area2 =    this.abs( (x2-px)*(y3-py) - (x3-px)*(y2-py) );
  var area3 =    this.abs( (x3-px)*(y1-py) - (x1-px)*(y3-py) );

  if (area1 + area2 + area3 === areaOrig) {
    return true;
  }
  return false;
}

p5.prototype.collidePointTriangleVector = function(p, p1, p2, p3){
  return p5.prototype.collidePointTriangle(p.x, p.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
}

p5.prototype.collidePointPoint = function (x,y,x2,y2, buffer) {
    if(buffer === undefined){
      buffer = 0;
    }

    if(this.dist(x,y,x2,y2) <= buffer){
      return true;
    }

  return false;
};

p5.prototype.collidePointPointVector = function(p1, p2, buffer){
  return p5.prototype.collidePointPoint(p1.x,p1.y,p2.x,p2.y, buffer);
}

p5.prototype.collidePointArc = function(px, py, ax, ay, arcRadius, arcHeading, arcAngle, buffer) {

  if (buffer === undefined) {
    buffer = 0;
  }
  var point = this.createVector(px, py);
  var arcPos = this.createVector(ax, ay);
  var radius = this.createVector(arcRadius, 0).rotate(arcHeading);

  var pointToArc = point.copy().sub(arcPos);

  if (point.dist(arcPos) <= (arcRadius + buffer)) {
    var dot = radius.dot(pointToArc);
    var angle = radius.angleBetween(pointToArc);
    if (dot > 0 && angle <= arcAngle / 2 && angle >= -arcAngle / 2) {
      return true;
    }
  }
  return false;
}

p5.prototype.collidePointArcVector = function(p1, a, arcRadius, arcHeading, arcAngle, buffer){
  return p5.prototype.collidePointArc(p1.x, p1.y, a.x, a.y, arcRadius, arcHeading, arcAngle, buffer);
}
