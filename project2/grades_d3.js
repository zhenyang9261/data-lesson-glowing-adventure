

  var svgWidth = 960;
  var svgHeight = 500;
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#grades-d3")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  var chosenXAxis = "federal_ppe";
  
  // function used for updating x-scale var upon click on axis label
  function xScale(factData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(factData, d => d[chosenXAxis]) * 0.8,
        d3.max(factData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newXScale, chosenXaxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  function renderTexts(textsGroup, newXScale, chosenXaxis) {
  
    textsGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return textsGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, circlesGroup) {
    
    var label;
    if (chosenXAxis === "federal_ppe") {
      label = "Federal Expense Per Pupil";
    }
    else if (chosenXAxis === "state_ppe") {
      label = "State Expense Per Pupil";
    }
    else {
      label = "Local Expense Per Pupil";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([60, -30])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
      });
  
    return circlesGroup;
  }
  
  function buildPlot(factData) {
  // Retrieve data from the CSV file and execute everything below
  //d3.csv("assets/data/data.csv", function(err, factData) {
    //d3.csv("assets/data/data.csv").then(function(factData) {
    
      //console.log(factData[0]);
    //if (err) throw err;
    
    // parse data
    factData.forEach(function(data) {
      data.federal_ppe = +data.federal_ppe;
      data.state_ppe = +data.state_ppe;
      data.local_ppe = +data.local_ppe;
      data.spg_score = +data.spg_score;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(factData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
       .domain([d3.min(factData, d => d.spg_score) * 0.8,
       d3.max(factData, d => d.spg_score) * 1.2])
       .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
   
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(factData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.spg_score))
      .attr("r", 10)
      .attr("fill", "lightblue")
      .attr("opacity", "1");
      
  //  var textsGroup = chartGroup.selectAll("text")
  //     .data(factData)
  //     .enter()
  //     // We return the abbreviation to .text, which makes the text the abbreviation.
  //     .append("text")
  //     .text(function(d) {
  //       return d.district_name;
  //     })
  //     // Now place the text using our scale.
  //     .attr("dx", function(d) {
  //       return xLinearScale(d[chosenXAxis]);
  //     })
  //     .attr("dy", function(d) {
  //       // When the size of the text is the radius,
  //       // adding a third of the radius to the height
  //       // pushes it into the middle of the circle.
  //       return yLinearScale(d.spg_score);
  //     })
  //     //.attr("class", "stateText")
  //     .attr("font-size", 9);
   
    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var federalLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "federal_ppe") // value to grab for event listener
      .classed("active", true)
      .text("Federal Expense Per Pupil");
  
    var stateLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "state_ppe") // value to grab for event listener
      .classed("inactive", true)
      .text("State Expense Per Pupil)");
    
    var localLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "local_ppe") // value to grab for event listener
      .classed("inactive", true)
      .text("Local Expense Per Pupil");
  
    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("School Performance Grades");
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(factData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
          textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "federal_ppe") {
            federalLabel
              .classed("active", true)
              .classed("inactive", false);
            stateLabel
              .classed("active", false)
              .classed("inactive", true);
            localLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "state_ppe") {
            stateLabel
              .classed("active", true)
              .classed("inactive", false);
            federalLabel
              .classed("active", false)
              .classed("inactive", true);
            localLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            localLabel
              .classed("active", true)
              .classed("inactive", false);
            stateLabel
              .classed("active", false)
              .classed("inactive", true);
            federalLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
}


/**
 * Function to display 
 * 
 */
function builddata() {

  // Use `d3.json` to fetch the data 
  //var metadataJson = d3.json("/api/d3");
  d3.json("/api/d3").then((data) => {
    console.log(data[0]);
    buildPlot(data);
    });
  //console.log(metadataJson);
  //buildPlot(metadataJson);

  // Use d3 to select the panel with id of `#sample-metadata`
  //metadataDiv = d3.select("#grades-d3");

  // Use `.html("") to clear any existing metadata
  //metadataDiv.html("");
  //console.log(metadataJson);
  // Use `Object.entries` to add each key and value pair to the panel
  // Append new tags for each key-value in the metadata.
  // metadataJson.then(function(metadata) {
  //    Object.entries(metadata).forEach(([key, value]) => {
  //     var newline = metadataDiv.append("div");
  //     newline.text(key +": " + value);
  //   });
  // });
}

builddata();