// Build the metadata panel
function buildMetadata(sample) {
  // Fetch the JSON data containing sample names, metadata, and sample values
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMeta = metadata.filter(sampleObj => sampleObj.id == String(sample));
    let result = filteredMeta[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      // Append a new `h6` tag for each key-value pair
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}


// function to build both charts
function buildCharts(sample) {
  // Fetch the JSON data containing sample names, metadata, and sample values
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == String(sample));
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };
    
    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 1000,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    
    // Slice the top 10 bacteria cultures and reverse the order for bar chart formatting
    let sliced_ids = otu_ids.slice(0,10);
    let sliced_labels = otu_labels.slice(0,10);
    let sliced_values = sample_values.slice(0,10);
    
    
    // Build a Bar Chart
  
    let barTrace = {
      x: sliced_values.reverse(),
      y: sliced_ids.map(object => `OTU ${object}`).reverse(),
      text: sliced_labels.reverse(),
      type: "bar",
      orientation: "h"
    };

    let barData = [barTrace];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to initialize the dashboard by loading the first sample's data and populating the dropdown menu
function init() {
  // Fetch the JSON data containing sample names, metadata, and sample values
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
// Event handler to update charts and metadata when a new sample is selected
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
