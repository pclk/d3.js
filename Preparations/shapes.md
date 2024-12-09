[toc]
## Basic SVG with Circle
```javascript
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

svg.append("circle")
  .attr("cx", 200)
  .attr("cy", 200)
  .attr("r", 100)
  .attr("fill", "blue");
```

## Multiple SVG Shapes
```javascript
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 500)
  .attr("height", 400);

// Line
svg.append("line")
  .attr("x1", 20)
  .attr("y1", 70)
  .attr("x2", 100)
  .attr("y2", 350)
  .attr("stroke", "brown")
  .attr("stroke-width", 5);

// Rectangle
svg.append("rect")
  .attr("x", 200)
  .attr("y", 50)
  .attr("width", 240)
  .attr("height", 120)
  .attr("fill", "blue");

// Ellipse
svg.append("ellipse")
  .attr("cx", 300)
  .attr("cy", 300)
  .attr("rx", 50)
  .attr("ry", 70)
  .attr("fill", "yellow");
```

## Data Binding with Array
```javascript
const data = [25, 20, 10, 12, 15];

const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

const circles = svg.selectAll("circle")
  .data(data);

circles.enter().append("circle")
  .attr("cx", (d, i) => (i * 50) + 50)
  .attr("cy", 250)
  .attr("r", (d) => d)
  .attr("fill", "red");

// Alternative logging version
// circles.enter().append("circle")
//   .attr("cx", (d, i) => {
//     console.log("Item: " + d, "Index: " +i)
//   })
//   .attr("cy", 250)
//   .attr("r", (d) => {
//     console.log(d)
//   })
//   .attr("fill", "red")
```

## Loading JSON Data
```javascript
d3.json("./data/ages.json").then(data => {
  data.forEach(d => {
    d.age = Number(d.age);
  });
  
  const svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

  const circles = svg.selectAll("circle")
    .data(data);

  circles.enter().append("circle")
    .attr("cx", (d, i) => (i * 50) + 50)
    .attr("cy", 250)
    .attr("r", (d) => 2 * d.age)
    .attr("fill", d => {
      if (d.name === "Tony") {
        return "blue";
      }
      else {
        return "red";
      }
    });
}).catch(error => {
  console.log(error);
});

// Alternative CSV loading examples
// d3.csv("/data/ages.csv", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     console.log(data[i].name);
//     console.log(Number(data[i].age));
//   }
// });

// d3.csv("/data/ages.csv").then(data => {
//   data.forEach(d => {
//     console.log(Number(d.age))
//   })
// })
```

## Bar Chart with Buildings Data
```javascript
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.json("data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height);
  });

  const rects = svg.selectAll("rect")
    .data(data);

  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (i * 60))
    .attr("width", 40)
    .attr("height", d => d.height)
    .attr("fill", "grey");
});
```

## with logging, squares
```js
// Create SVG canvas
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400)

console.log("SVG canvas created:", {
  width: svg.attr("width"),
  height: svg.attr("height")
})

// Load and process data
d3.json("data/ages.json").then(data => {
  console.log("Raw data loaded:", data)

  // Convert age strings to numbers
  data.forEach(d => {
    d.age = Number(d.age)
  })

  console.log("Processed data:", data)

  // Select all rectangles (even though none exist yet)
  const squares = svg.selectAll("rect")
    .data(data)

  console.log("Data binding created:", {
    enterSelection: squares.enter().size(),
    updateSelection: squares.size(),
    exitSelection: squares.exit().size()
  })

  // Create new rectangles
  squares.enter().append("rect")
    .attr("x", (d, i) => {
      const xPosition = (i * 50) + 50
      console.log(`Square ${d.name} x position:`, xPosition)
      return xPosition
    })
    .attr("y", (d) => {
      // Calculate y position so square centers at y=250
      const size = 4 * d.age  // Width/height of square
      const yPosition = 250 - (size / 2)  // Center at 250
      console.log(`Square ${d.name} y position:`, yPosition)
      return yPosition
    })
    .attr("width", (d) => {
      const size = 4 * d.age
      console.log(`Square ${d.name} size:`, size)
      return size
    })
    .attr("height", (d) => 4 * d.age)  // Same as width for square
    .attr("fill", d => {
      const color = d.name === "Tony" ? "blue" : "red"
      console.log(`Square ${d.name} color:`, color)
      return color
    })

  console.log("Squares creation complete")

}).catch(error => {
  console.error("Error loading or processing data:", error)
})
```

## custom shapes

```js
const svg = d3.select("#chart-area").append("svg")
.attr("width", 400)
.attr("height", 1000)

d3.json("data/ages.json").then(data => {
  console.log("Raw data loaded:", data)
  data.forEach(d => {
    d.age = Number(d.age)
  })

  // 1. Circles (as reference)
  svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", (d, i) => (i * 100) + 50)
    .attr("cy", 50)
    .attr("r", d => d.age * 2)
    .attr("fill", "red")

  // 2. Ellipses
  svg.selectAll("ellipse")
    .data(data)
    .enter().append("ellipse")
    .attr("cx", (d, i) => (i * 100) + 50)
    .attr("cy", 150)
    .attr("rx", d => d.age * 2)  // horizontal radius
    .attr("ry", d => d.age)      // vertical radius
    .attr("fill", "blue")

  // 3. Regular Polygons (using path)
  const createPolygon = (centerX, centerY, radius, sides) => {
    const points = []
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides
      points.push([
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      ])
    }
    return "M" + points.map(p => p.join(",")).join("L") + "Z"
  }

  // Triangles
  svg.selectAll(".triangle")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createPolygon((i * 100) + 50, 250, d.age * 2, 3))
    .attr("fill", "green")

  // 4. Stars
  const createStar = (centerX, centerY, radius, points) => {
    const innerRadius = radius * 0.4
    const angleStep = Math.PI / points
    const path = []

    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : innerRadius
      const angle = i * angleStep
      path.push([
        centerX + r * Math.sin(angle),
        centerY + r * Math.cos(angle)
      ])
    }

    return "M" + path.map(p => p.join(",")).join("L") + "Z"
  }

  svg.selectAll(".star")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createStar((i * 100) + 50, 350, d.age * 2, 5))
    .attr("fill", "purple")

  // 5. Custom shapes using line
  const createDiamond = (x, y, size) => {
    return `
M ${x},${y - size}    
L ${x + size},${y}   
L ${x},${y + size}  
L ${x - size},${y} 
Z                 
`
    // return `
    //     M ${x},${y-size}    // Start at top
    //     L ${x+size},${y}    // Go to right
    //     L ${x},${y+size}    // Go to bottom
    //     L ${x-size},${y}    // Go to left
    //     Z                   // Close the path
    // `
  }

  svg.selectAll(".diamond")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createDiamond((i * 100) + 50, 450, d.age * 2))
    .attr("fill", "purple")
    .attr("stroke", "black")

  // 2. House shape
  const createHouse = (x, y, size) => {
    return `
M ${x - size},${y}        
L ${x - size},${y - size}
L ${x},${y - size * 1.5}    
L ${x + size},${y - size}  
L ${x + size},${y}
Z
`
    // return `
    //     M ${x-size},${y}        // Start at bottom left
    //     L ${x-size},${y-size}   // Left wall
    //     L ${x},${y-size*1.5}    // Roof left
    //     L ${x+size},${y-size}   // Roof right
    //     L ${x+size},${y}        // Right wall
    //     Z                       // Close the path
    // `
  }

  svg.selectAll(".house")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createHouse((i * 100) + 50, 550, d.age * 2))
    .attr("fill", "red")
    .attr("stroke", "black")

  // 3. Arrow shape
  const createArrow = (x, y, size) => {
    return `
M ${x},${y}             
L ${x - size},${y - size}   
L ${x - size / 2},${y - size} 
L ${x - size / 2},${y - size * 2} 
L ${x + size / 2},${y - size * 2} 
L ${x + size / 2},${y - size} 
L ${x + size},${y - size}
Z
`
    // return `
    //     M ${x},${y}             // Start at point
    //     L ${x-size},${y-size}   // Upper diagonal
    //     L ${x-size/2},${y-size} // Upper notch
    //     L ${x-size/2},${y-size*2} // Shaft top
    //     L ${x+size/2},${y-size*2} // Shaft bottom
    //     L ${x+size/2},${y-size} // Lower notch
    //     L ${x+size},${y-size}   // Lower diagonal
    //     Z                       // Close the path
    // `
  }

  svg.selectAll(".arrow")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createArrow((i * 100) + 50, 650, d.age * 2))
    .attr("fill", "green")
    .attr("stroke", "black")

  // 4. Plus shape
  const createPlus = (x, y, size) => {
    const thickness = size / 3
    return `
M ${x - thickness},${y - size}    
L ${x + thickness},${y - size}    
L ${x + thickness},${y - thickness} 
L ${x + size},${y - thickness}    
L ${x + size},${y + thickness}   
L ${x + thickness},${y + thickness} 
L ${x + thickness},${y + size}    
L ${x - thickness},${y + size}   
L ${x - thickness},${y + thickness} 
L ${x - size},${y + thickness}    
L ${x - size},${y - thickness}   
L ${x - thickness},${y - thickness}
Z
`
    // return `
    //     M ${x-thickness},${y-size}    // Top of vertical
    //     L ${x+thickness},${y-size}    // Top right
    //     L ${x+thickness},${y-thickness} // Upper right
    //     L ${x+size},${y-thickness}    // Right outer
    //     L ${x+size},${y+thickness}    // Right lower
    //     L ${x+thickness},${y+thickness} // Lower right
    //     L ${x+thickness},${y+size}    // Bottom right
    //     L ${x-thickness},${y+size}    // Bottom left
    //     L ${x-thickness},${y+thickness} // Lower left
    //     L ${x-size},${y+thickness}    // Left outer
    //     L ${x-size},${y-thickness}    // Left upper
    //     L ${x-thickness},${y-thickness} // Upper left
    //     Z                             // Close path
    // `
  }

  svg.selectAll(".plus")
    .data(data)
    .enter().append("path")
    .attr("d", (d, i) => createPlus((i * 100) + 50, 750, d.age * 2))
    .attr("fill", "blue")
    .attr("stroke", "black")

  console.log("All shapes rendered")

}).catch(error => {
    console.error("Error:", error)
  })
```
