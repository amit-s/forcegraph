import * as d3 from 'd3';

let width = 1200;
let height = 900;
let margin = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
};
let url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

let svg = d3.select("body").append("svg")
							.attr("width", width)
							.attr("height", height);

svg.append("text")
	.text("Force Directed Graph Showing National Contiguity")
	.attr("x", 100)
	.attr("y", 50)
	.style("font-size", "2.5em");

d3.json(url, drawForceGraph);

function drawForceGraph(data){
	let { nodes, links } = data;
	
	let force = d3.forceSimulation()
					.nodes(nodes)
					.force("link", d3.forceLink(links).distance(25))
					.force("charge", d3.forceManyBody().strength(-6))
					.force("collide", d3.forceCollide(25))
					.force("center", d3.forceCenter(width/2 - 50, height/2 - 50))					
					.on('tick', tick);

	let link = svg.selectAll(".link")
				.data(links)
				.enter()
				.append("line")
				.attr("class", "link");

	var img = d3.selectAll(".img")
        .data(nodes)
        .enter()
        .append('img')
        .attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
        .attr("class", d=>`img flag flag-${d.code}`)
        .on('mouseover', function(d){
        	d3.select("#tooltip")
        		.text(d.country)
        		.style("top", `${d.y - 25}px` )
        		.style("left", `${d.x}px` )
        		.classed("hidden", false);
        })
        .on('mouseout', function(d){
        	d3.select("#tooltip")
        		.classed("hidden", true);
        })
        .call(d3.drag()
        		.on('start', dragStart)
        		.on('drag', dragDrag)
        		.on('end', dragEnd)
        	);

	function tick(){
		img.style("left", function(d) { return (d.x - 8) +"px"; })
      		.style("top", function(d) { return (d.y - 8) + "px"; });

		link.attr("x1", d=>d.source.x)
			.attr("y1", d=>d.source.y)
			.attr("x2", d=>d.target.x)
			.attr("y2", d=>d.target.y);
	}

	function dragStart(d){
		if(!d3.event.active)
			force.alphaTarget(0.3). restart();

		d.fx = d.x;
		d.fy = d.y;
	}

	function dragDrag(d){
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragEnd(d){
		if(!d3.event.active)
			force.alphaTarget(0);

		d.fx = null;
		d.fy = null;
	}

}
