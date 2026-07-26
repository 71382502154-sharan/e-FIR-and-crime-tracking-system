const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsDashboard.tsx', 'utf8');

const oldD3Init = `    const simulation = d3.forceSimulation(graphData.nodes as any)
      .force('link', d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))`;

const newD3Init = `    const nodes = graphData.nodes.map((d: any) => ({ ...d }));
    const links = graphData.links.map((d: any) => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))`;

file = file.replace(oldD3Init, newD3Init);
file = file.replace("      .data(graphData.links)", "      .data(links)");
file = file.replace("      .data(graphData.nodes)", "      .data(nodes)");

fs.writeFileSync('src/components/AnalyticsDashboard.tsx', file);
