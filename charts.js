function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //Create a variable that holds the samples/metadata array. 
    var samples = data.samples;
    var metadata = data.metadata;

    //Create a variable that filters the samples/metadata for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //Create a variable that holds the first sample/metadata in the array.
    var resultSample = sampleArray[0];
    var washingF=resultArray[0].wfreq;

    //Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_array = resultSample.otu_ids;
    var otu_labels_array = resultSample.otu_labels;
    var sample_values_array = resultSample.sample_values;

    //create bar chart
    //combine the two arrays, sort them and then seperate them
    var list = [];
    var x=[];
    var y=[];
    var label=[];
    for (var j = 0; j < sample_values_array.length; j++) 
        list.push({'otu_ids': otu_ids_array[j], 'otu_labels':otu_labels_array[j], 'sample_values': sample_values_array[j]});
    var sorted_list=list.sort((a,b) => a.sample_values - b.sample_values).slice(-10); 
    for (var k = 0; k < sorted_list.length; k++) {
      y[k] = ("OTU"+sorted_list[k].otu_ids);
      x[k] = sorted_list[k].sample_values;
      label[k]=sorted_list[k].otu_labels;
    }
    var trace= {
      x: x,
      y: y,
      text:label,
      type: "bar",
      orientation: 'h'
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values" },
      yaxis: {title: " "},
      width:300,
      height: 350,
      plot_bgcolor:"#e0edee",
      paper_bgcolor:"#e0edee" 
    };
    Plotly.newPlot("bar", barData, barLayout);

    //create bubble chart 
    var trace1= {
      x: otu_ids_array,
      y: sample_values_array,
      text:otu_labels_array,
      mode: "markers",
      marker: {
        color:otu_ids_array,
        size: sample_values_array
      }
    };
    var bubbleData = [trace1]
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU_ID" },
      yaxis: {title: " "},
      plot_bgcolor:"#e0edee",
      paper_bgcolor:"#e0edee" 
    };

    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // Create gauge chart
    var gaugeData = [
      {
        value:washingF,
        title:{text:"Belly Button Washing Frequency"},
        type:"indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color:"red"},
            { range: [2, 4], color:"orange"},
            { range: [4, 6], color:"yellow"},
            { range: [6, 8], color:"lightgreen"},
            { range: [8,10], color:"green"}
          ],
          bar:{color:"black"}
        }
      }
    ];
    var gaugeLayout = { 
      width:300,
      height: 350,
      plot_bgcolor:"#e0edee",
      paper_bgcolor:"#e0edee" 
    };

    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
 
  });
}
