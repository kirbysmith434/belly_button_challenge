// Define the URL of the JSON file
const jsonUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Define layout for the bar chart
const layout = {
  title: 'Top 10 OTUs Found in Individual',
  xaxis: { title: 'Sample Values' },
  yaxis: { title: 'OTU IDs' }
};

// Function to update all plots when a new sample is selected
function optionChanged(selectedSample) {
  // Use the selected sample to filter data
  const selectedData = data.samples.find(sample => sample.id === selectedSample);

  // Update the bar chart
  const updatedBarData = [{
    type: 'bar',
    x: selectedData.sample_values.slice(0, 10).reverse(),
    y: selectedData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
    text: selectedData.otu_labels.slice(0, 10).reverse(),
    orientation: 'h'
  }];

  Plotly.newPlot('bar', updatedBarData, layout);

  // Update the bubble chart
  const bubbleLayout = {
    title: 'Bubble Chart for Each Sample',
    xaxis: { title: 'OTU IDs' },
    yaxis: { title: 'Sample Values' }
  };

  const updatedBubbleData = [{
    type: 'scatter',
    mode: 'markers',
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    text: selectedData.otu_labels,
    marker: {
      size: selectedData.sample_values,
      color: selectedData.otu_ids,
      colorscale: 'Earth'
    }
  }];

  Plotly.newPlot('bubble', updatedBubbleData, bubbleLayout);

  // Display metadata
  displayMetadata(selectedSample);
}

// Function to display metadata for the selected sample
function displayMetadata(selectedSample) {
  // Use the selected sample to filter metadata
  const selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));

  // Select the HTML element to display metadata
  const metadataPanel = d3.select("#sample-metadata");

  // Clear existing metadata
  metadataPanel.html("");

  // Append each key-value pair to the panel
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Use D3 to fetch the JSON data
d3.json(jsonUrl)
  .then(data => {
    // Save the data globally for easy access in other functions
    window.data = data;

    // Populate the existing dropdown menu
    const dropdownMenu = d3.select("#selDataset");
    data.names.forEach(name => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    // Initial call to populate the charts and metadata
    optionChanged(data.names[0]);
  })
  .catch(error => {
    // Handle errors if any
    console.error("Error fetching JSON:", error);
  });
