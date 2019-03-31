let date = new Date()

let origin = [480, 300], 
    j = 10, 
    scale = 20, 
    scatter = [], 
    xLine = [],
    yLine = [], 
    zLine = [],
    scales = [],
    axisArrows = [],
    beta = 0, alpha = 0, 
    key = d => d.id, 
    startAngleX = Math.PI/4,
    startAngleZ = 3*Math.PI/4,
    axisRange = 20

let a = new Earth()
let b = new Venus()
let c = new Mars()
let d = new Mercury()
let e = new Jupiter()
let f = new Saturn()
let g = new Uranus()
let h = new Neptune()
    
let svg = d3.select('svg')
  .call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g')
let color  = d3.scaleOrdinal(d3.schemeCategory20)
let mx, my, mouseX, mouseY

let point3d = d3._3d()
  .x(d => d.x)
  .y(d => d.y)
  .z(d => d.z)
  .origin(origin)
  .rotateX(startAngleX)
  .rotateZ(startAngleZ)
  .scale(scale)

let scale3d = d3._3d() 
  .shape('LINE_STRIP')
  .origin(origin)
  .rotateX(startAngleX)
  .rotateZ(startAngleZ)
  .scale(scale)

let arrows3d = d3._3d()
    .shape('TRIANGLE')
    .origin(origin)
    .rotateX(startAngleX)
    .rotateZ(startAngleZ)
    .scale(scale)

let draw = (data, delay) => {

  let axisColor = (shape, i) => {
    if(shape=='arrow') {
      if(i==0 || i==1) return 'blue'
      else if(i==2 || i==3) return 'red'
      else return 'green'
    }
    else {
      if(i==0) return 'blue'
      else if(i==1) return 'red'
      else return 'green'
    }
  }

  [pointData, scaleData, arrowData] = data

  let points = svg.selectAll('circle').data(pointData, key)

  points
      .enter()
      .append('circle')
      .attr('class', '_3d')
      .attr('opacity', 0)
      .attr('cx', d => d.projected.x)
      .attr('cy', d => d.projected.y)
      .merge(points)
      .transition().duration(delay)
      .attr('r', d => d.radius/10000)
      .attr('stroke', d => d3.color(color(d.id)).darker(3))
      .attr('fill', d => color(d.id))
      .attr('opacity', 1)
      .attr('cx', d => d.projected.x)
      .attr('cy', d => d.projected.y)

  points.exit().remove()

  let names = svg.selectAll(`text.planets`).data(pointData)
  names.enter()
       .append('text')
       .attr('class', `_3d planets`)
        .attr('dx', '-3em')
        .merge(names)
        .each(d => {
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
        })
        .attr('x', d => d.projected.x)
        .attr('y', d => d.projected.y)
        .text(d => d.id)
        .style('fill', 'red')


  let scales = svg.selectAll('path.scale').data(scaleData)

  scales
      .enter()
      .append('path')
      .attr('class', '_3d scale')
      .merge(scales)
      .attr('stroke', (d, i) => axisColor('scale', i))
      .attr('stroke-width', .5)
      .attr('d', scale3d.draw)

  scaleData.forEach((d, i) => {
    let text = svg.selectAll(`text.text${i}`).data(d.slice(d.length-1, d.length))
    text.enter()
        .append('text')
        .attr('class', `_3d text${i}`)
        .attr('dx', '-2em')
        .merge(text)
        .each(d => {
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
        })
        .attr('x', d => d.projected.x)
        .attr('y', d => d.projected.y)
        .text(() => { 
          if(i==0) return 'x'
          else if(i==1) return 'y'
          else return 'z'
        })
        .style('fill', axisColor('text', i))

  })

  arrowData.forEach((projectedArrows, i) => {
    triangles = svg.selectAll('path.triangles').data(projectedArrows)
    triangles
      .enter()
      .append('path')
      .attr('class', '_3d triangles')
      .merge(triangles)
      .attr('stroke', (d, i) => axisColor('arrow', i))
      .attr('fill', (d, i) => axisColor('arrow', i))
      .attr('d', arrows3d.draw)
    triangles.exit().remove()
  })

  d3.selectAll('._3d').sort(d3._3d().sort)
}

init = () => {
  let cnt = 0
  scatter = [], yLine = [], xLine = [], zLine = []

  d3.range(0, axisRange, 1).forEach(d => xLine.push([d, 0, 0]))
  d3.range(0, axisRange, 1).forEach(d => yLine.push([0, -d, 0]))
  d3.range(0, axisRange, 1).forEach(d => zLine.push([0, 0, d]))

  axisArrows = [[[axisRange-1, 0.3, 0], [axisRange-1, -0.3, 0], [axisRange, 0, 0]], [[axisRange-1, 0, -0.3,], [axisRange-1, 0, 0.3], [axisRange, 0, 0]], [[-0.3, -axisRange+1, 0], [0.3, -axisRange+1, 0], [0, -axisRange, 0]], [[0, -axisRange+1, -0.3], [0, -axisRange+1, 0.3], [0, -axisRange, 0]], [[-0.3, 0, axisRange-1], [0.3, 0, axisRange-1], [0, 0, axisRange]], [[0, -0.3, axisRange-1], [0, 0.3, axisRange-1], [0, 0, axisRange]]]


  planets = [a, b, c, d, e, f, g, h]
  planets.forEach(p => {
      position = p.heliocentric_position(date.getFullYear(), date.getMonth()+1, date.getUTCDate(), date.getUTCHours())
      scatter.push({x: position[0], y: position[1], z: position[2], radius: p.radius(), id: `${p.constructor.name}`})
  })
  scatter.push({x: 0, y:0, z:0, radius: 432170, id: 'Sun'})
  let chart = [
      point3d(scatter),
      scale3d([xLine, yLine, zLine]),
      [arrows3d(axisArrows)]
  ]
  draw(chart, 1000)
}

function dragStart(){
  mx = d3.event.x
  my = d3.event.y
}

function dragged(){
  mouseX = mouseX || 0
  mouseY = mouseY || 0

  beta   = (d3.event.x - mx + mouseX) * Math.PI / 2300 
  alpha  = (d3.event.y - my + mouseY) * Math.PI / 2300  * (-1)

  let data = [
      point3d.rotateX(alpha + startAngleX).rotateZ(beta + startAngleZ)(scatter),
      scale3d.rotateX(alpha + startAngleX).rotateZ(beta + startAngleZ)([xLine, yLine, zLine]),
      [arrows3d.rotateX(alpha + startAngleX).rotateZ(beta + startAngleZ)(axisArrows)]
  ]
  draw(data, 0)
}

function dragEnd(){
  mouseX = d3.event.x - mx + mouseX
  mouseY = d3.event.y - my + mouseY
}

function updateData(){
  let newDate = new Date(date)
  newDate.setDate(date.getUTCDate()+1)
  date = new Date(newDate)
  scatter = []
  planets.forEach(p => {
      position = p.heliocentric_position(date.getFullYear(), date.getMonth()+1, date.getUTCDate(), date.getUTCHours())
      scatter.push({x: position[0], y: position[1], z: position[2], radius: p.radius(), id: `${p.constructor.name}`})
  })
  scatter.push({x: 0, y:0, z:0, radius: 432170, id: 'Sun'})
  let chart = [
      point3d(scatter),
      scale3d([xLine, yLine, zLine]),
      [arrows3d(axisArrows)]
  ]
  draw(chart, 1000)
}

let inter = setInterval(function() {
                updateData()
        }, 1000)

init()
