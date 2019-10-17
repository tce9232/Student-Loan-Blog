
// set the dimensions and tsnemargins of the graph
var tsnemargin = {top: 10, right: 10, bottom: 30, left: 20},
    tsnewidth = 860 - tsnemargin.left - tsnemargin.right,
    tsneheight =600 - tsnemargin.top - tsnemargin.bottom;

max = 150;

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


// append the svg object to the body of the page
var plot = d3.select("#tsne")
  .append("svg")
    .attr("width", tsnewidth + tsnemargin.left + tsnemargin.right)
    .attr("height", tsneheight + tsnemargin.top + tsnemargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + tsnemargin.left + "," + tsnemargin.top + ")")
  

plot.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", tsnewidth)
    .attr("height", tsneheight);

//Read the data
d3.csv("./Data/CollegeClusters.csv", function(data) {

  // Add X axis
  var xScale = d3.scaleLinear()
    .domain([-80, 80])
    .range([ 0, tsnewidth ]);
  
  // Add Y axis
  var yScale = d3.scaleLinear()
    .domain([-80, 80])
    .range([ tsneheight, 0]);
  
  var xAxis = d3.axisBottom(xScale)
    .ticks(20, "s");
  var yAxis = d3.axisLeft(yScale)
    .ticks(20, "s");

  var gX = plot.append('g')
    .attr('transform', 'translate(' + tsnemargin.left + ',' + (tsnemargin.top + tsneheight) + ')')
    .call(xAxis);
  var gY = plot.append('g')
    .attr('transform', 'translate(' + tsnemargin.left + ',' + tsnemargin.top + ')')
    .call(yAxis);



  // Pan and zoom
  var zoom = d3.zoom()
    .scaleExtent([.5, 20])
    .extent([[0, 0], [tsnewidth, tsneheight]])
    .on("zoom", zoomed);

  plot.append("rect")
    .attr("width", tsnewidth)
    .attr("height", tsneheight)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + tsnemargin.left + ',' + tsnemargin.top + ')')
    
  plot.call(zoom);

  var tsnecolor = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#8da0cb", "#e78ac3", "#a6d854", "#66c2a5", "#fc8d62"])

  var clustermap = d3.scaleOrdinal()
    .range([ "one", "two", "three", "four", "five"])

  var highlight = function(d){

    selected_cluster = d.cluster


    d3.select("#tsne_dataviz").selectAll("circle")
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + clustermap(selected_cluster))
      .style("fill", tsnecolor(selected_cluster))
      .attr("r", 3.5)
  }



  function zoomed() {
// create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
// update axes
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
    points.data(data)
     .attr('cx', function(d) {return new_xScale(d.tsnex)})
     .attr('cy', function(d) {return new_yScale(d.tsney)});
}

  var doNotHighlight = function(){

    d3.select("#tsne_dataviz")
      .selectAll("circle")
      .style("fill", function (d) { return tsnecolor(+d.cluster) } )
      .attr("r", 3)
  }

// Draw Datapoints
var points_g = plot.append("g")
  .attr('transform', 'translate(' + tsnemargin.left + ',' + tsnemargin.top + ')')
  // .attr("clip-path", "url(#clip)")
  .classed("points_g", true);

var points = points_g.selectAll("dot").data(data);
points = points
          .enter()
          .append("circle")
            .attr('cx', function(d) {return xScale(d.tsnex)})
            .attr('cy', function(d) {return yScale(d.tsney)})
            .attr("class", function (d) { return "circle " + clustermap(d.cluster) } )
            .classed('tsnecircles',true)
            .attr('r', 3)
            .attr("opacity", .5)
            .style("fill", function (d) { return tsnecolor(+d.cluster) } )
            .on("mouseenter", function(d) {	
                  div.transition()			
                      .style("opacity", .75);		
                  div	.html(d["Institution Name"] + "<br/>"  + "Avg Grant Aid: " + +d['Average amount of federal  state  local or institutional grant aid awarded (SFA1516)'] + "<br/>" + "Avg Loans: " + +d["Average amount of federal student loans awarded to full-time first-time undergraduates (SFA1516)"] + "<br/>" + "Number of Undergrads: " + +d["UGDS"] + "<br/>"  + "Median Debt: " + +d["GRAD_DEBT_MDN_SUPP"]+ "<br/>"  + "Median Earnings: " + +d["MD_EARN_WNE_P10"]+ "<br/>"  + "Default Rate: " + +d["CDR3"]+ "<br/>"  + "Net Cost: " + +d["net cost"]+ "<br/>"  + "Proportion of men: " + +d["UGDS_MEN"]+ "<br/>"  + "Proportion of black students: " + +d["UGDS_BLACK"])	
                      .style("left", (d3.event.pageX + 10) + "px")		
                      .style("top", (d3.event.pageY - 80) + "px");	
                  })
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)								
            .on("mouseout", function(d) {		
                  div.transition()		
                      .duration(200)		
                      .style("opacity", 0);	
                })
            .on("click", function(d) {		
                  div.transition()		
                      .duration(200)		
                      .style("opacity", 0)
                      

                });

})

