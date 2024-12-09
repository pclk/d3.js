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
