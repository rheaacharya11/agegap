// Artist's Statement: For this project, I came across this interesting dataset at the TidyTuesday site 
// (https://github.com/rfordatascience/tidytuesday/tree/master/data/2023/2023-02-14)
// and decided that I really wanted to make a visualization of it. I spent hours pouring over the dataset in a Jupyter Notebook
// but honestly nothing that stand-out came up, so I thought I might find more intrigue and get more inspiration if I just
// start playing around with a more 2-D fleshed out visualization.

// I started playing around and found that this concept of "largest age gap" was most intriguing, especially to see how this
// changes as we vary the gender and age of those involved. What types of relationships are 20 year old females depicted to be engaged in?
//. What about 20 year old men? How does this change as we change the base year?

// There isn't just one (1) surprising element that I want the viewer to look at in particular. It is more so that I want the 
// the viewer to play around with the buttons and then see the surprising elements in each layer. Most of this surprise is supposed
// to come through from the element of scale, color, and slope, as viewers see striking differences in the largest age gap for different
// values of age and gender and also different trends in the overall result.

// Use of generative AI: I made the initial figures on my own, but then I passed it through ChatGPT a few times to help me get some of the
// positioning better and less buggy. I also used chatGPT's help for figuring out how to do the largest age gap, and also for how
// to have the pop-ups work well.



let data;
let agePairs = {};
let womenAges = new Map();
let menAges = new Map();
let lineXWomen, lineXMen;
let selectedAge = null;
let largestAgeGapMovieYoungerWoman = '';  
let partnerAgeForLargestGapWoman = null;
let largestAgeGapMovieYoungerMan = '';    
let partnerAgeForLargestGapMan = null;
let actor1NameYoungerWoman = '';  
let actor2NameYoungerWoman = '';  
let actor1NameYoungerMan = '';    
let actor2NameYoungerMan = '';    
let noMovieExistsForWoman = true; 
let noMovieExistsForMan = true;   

function preload() {
  data = loadTable('age_gaps.csv', 'csv', 'header');
  customFont = loadFont('Starborn.ttf');
  montserrat = loadFont('Montserrat-Regular.ttf');
  montserratBold = loadFont('Montserrat-Bold.ttf');  // Load the bold variant of Montserrat
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  textFont(customFont);
  textSize(32);
  lineXWomen = width / 3;
  lineXMen = (2 * width) / 3;

  let numRows = data.getRowCount();
  for (let i = 0; i < numRows; i++) {
    let age1 = data.getNum(i, 'actor_1_age');
    let age2 = data.getNum(i, 'actor_2_age');
    let gender1 = data.getString(i, 'character_1_gender');
    let gender2 = data.getString(i, 'character_2_gender');
    let movieName = data.getString(i, 'movie_name');
    let actor1Name = data.getString(i, 'actor_1_name');
    let actor2Name = data.getString(i, 'actor_2_name');

    let pairKey = `${age1}-${age2}-${gender1}-${gender2}`;
    if (!agePairs[pairKey]) {
      agePairs[pairKey] = { count: 1, age1, age2, gender1, gender2, movie: movieName, actor1Name, actor2Name };
    } else {
      agePairs[pairKey].count++;
    }

    if (gender1 === "woman" && !womenAges.has(age1)) {
      womenAges.set(age1, map(age1, 0, 100, height, 0));
    } else if (gender1 === "man" && !menAges.has(age1)) {
      menAges.set(age1, map(age1, 0, 100, height, 0));
    }

    if (gender2 === "woman" && !womenAges.has(age2)) {
      womenAges.set(age2, map(age2, 0, 100, height, 0));
    } else if (gender2 === "man" && !menAges.has(age2)) {
      menAges.set(age2, map(age2, 0, 100, height, 0));
    }
  }
}

function draw() {
  background(255);
  textSize(48);
  textFont(customFont);
  fill(0);
  textAlign(CENTER, TOP);
  text("Love Can't Count", width / 2, 30);
  textFont(montserrat);
  textSize(18);
  fill(100);
  text("AGE GAP OF ACTORS IN HOLLYWOOD MOVIES", width / 2, 95);

  // Y-axis label
  textSize(16);
  textAlign(CENTER);
  push();
  translate(50, height / 2);
  rotate(-PI / 2);
  text("Age", 0, 0);
  pop();

  // X-axis labels
  textAlign(CENTER);
  text("Women", lineXWomen, height - 40);
  text("Men", lineXMen, height - 40);

	if (selectedAge == null){
		text("Click on the circles to begin!", width / 2, height /2);
	}
  // Draw light purple and dark purple lines
  if (selectedAge !== null) {
    drawAgeConnections();
		drawSameGenderCurvedLines(); 
  }
	

  drawAgeCircles();
  drawSelectedCircle();  // Ensure selected circle is drawn on top

  // Draw the vertical lines between the selected age and the partner's age for the largest age gap movies
  drawVerticalLineForLargestGap();

  // Display the selected age and largest age gap movies
  displayTextBoxes();
}

function drawAgeConnections() {
  for (let key in agePairs) {
    let pair = agePairs[key];
    let y1 = pair.gender1 === "woman" ? womenAges.get(pair.age1) : menAges.get(pair.age1);
    let y2 = pair.gender2 === "woman" ? womenAges.get(pair.age2) : menAges.get(pair.age2);

    // Draw all lines coming from the selected woman in pink
    if (pair.age1 === selectedAge && pair.gender1 === 'woman') {
      stroke('#FFC0CB');  // Pink for woman connections
      strokeWeight(1);
      let lineX1 = lineXWomen;
      let lineX2 = pair.gender2 === "woman" ? lineXWomen : lineXMen;  // Partner can be woman or man
      line(lineX1, y1, lineX2, y2);
    } else if (pair.age2 === selectedAge && pair.gender2 === 'woman') {
      stroke('#FFC0CB');  // Pink for woman connections
      strokeWeight(1);
      let lineX1 = lineXWomen;
      let lineX2 = pair.gender1 === "woman" ? lineXWomen : lineXMen;  // Partner can be woman or man
      line(lineX1, y2, lineX2, y1);
    }

    // Draw all lines coming from the selected man in blue
    if (pair.age1 === selectedAge && pair.gender1 === 'man') {
      stroke('#a2b6ff');  // Blue for man connections
      strokeWeight(1);
      let lineX1 = lineXMen;
      let lineX2 = pair.gender2 === "man" ? lineXMen : lineXWomen;  // Partner can be woman or man
      line(lineX1, y1, lineX2, y2);
    } else if (pair.age2 === selectedAge && pair.gender2 === 'man') {
      stroke('#a2b6ff');  // Blue for man connections
      strokeWeight(1);
      let lineX1 = lineXMen;
      let lineX2 = pair.gender1 === "man" ? lineXMen : lineXWomen;  // Partner can be woman or man
      line(lineX1, y2, lineX2, y1);
    }
  }
}

function drawSameGenderCurvedLines() {
  for (let key in agePairs) {
    let pair = agePairs[key];

    // Check if the selected age is part of the same-gender pair
    if ((pair.age1 === selectedAge || pair.age2 === selectedAge) && pair.gender1 === pair.gender2) {
      let y1 = pair.gender1 === "woman" ? womenAges.get(pair.age1) : menAges.get(pair.age1);
      let y2 = pair.gender2 === "woman" ? womenAges.get(pair.age2) : menAges.get(pair.age2);
      let x = pair.gender1 === "woman" ? lineXWomen : lineXMen;

      // Draw a  curved line outward for same-gender pairs
      strokeWeight(1);
      noFill();
      beginShape();
      vertex(x, y1);

      // Adjust control points for outward curves
      if (pair.gender1 === "woman") {
				stroke('#FFC0CB');
        bezierVertex(x - 20, (y1 + y2) / 2, x - 20, (y1 + y2) / 2, x, y2);  // Curve outward to the left for women
      } else {
				stroke('#a2b6ff'); 
        bezierVertex(x + 20, (y1 + y2) / 2, x + 20, (y1 + y2) / 2, x, y2);  // Curve outward to the right for men
      }

      endShape();
    }
  }
}


function drawAgeCircles() {
  // Draw circles for women (unselected)
  for (let [age, y] of womenAges) {
    if (age !== selectedAge) {
      fill('#FFC0CB');  // Regular pink color for unselected circles
      noStroke();
      ellipse(lineXWomen, y, 10, 10);  // Draw the circle
    }
  }

  // Draw circles for men (unselected)
  for (let [age, y] of menAges) {
    if (age !== selectedAge) {
      fill('#a2b6ff');  // Regular blue color for unselected circles
      noStroke();
      ellipse(lineXMen, y, 10, 10);  // Draw the circle
    }
  }
}

// Draw the selected circle last to keep it on top
function drawSelectedCircle() {
  if (selectedAge !== null) {
    // Check if selectedAge is for women
    if (womenAges.has(selectedAge)) {
      let y = womenAges.get(selectedAge);
      fill('#C71585');  // Darker hue for selected circle (darker pink)
      noStroke();
      ellipse(lineXWomen, y, 10, 10);  // Draw the selected circle on top
    }

    // Check if selectedAge is for men
    if (menAges.has(selectedAge)) {
      let y = menAges.get(selectedAge);
      fill('#00008B');  // Darker hue for selected circle (darker blue)
      noStroke();
      ellipse(lineXMen, y, 10, 10);  // Draw the selected circle on top
    }
  }
}

// Function to display selected age and largest age gap movies
function displayTextBoxes() {
  if (selectedAge !== null) {
    let boxWidth = width / 6;  // Make the boxes skinnier
    let boxHeight = 160;

    // Display largest age gap movie for the selected person, regardless of younger or older
    if (largestAgeGapMovieYoungerWoman !== '' || !noMovieExistsForWoman) {
      fill('#FFC0CB');  // Pastel pink background
      stroke(0);  // Black outline
      strokeWeight(2);
      let boxXLeft = lineXWomen - boxWidth - 100;  // Far-left side
      let boxYLeft = height / 3;  // Center it vertically
      rect(boxXLeft, boxYLeft, boxWidth, boxHeight);  // Draw box

      // Bold "Selected Woman"
      fill(0);
      noStroke();
      textSize(16);
      textAlign(LEFT, TOP);
      textStyle(BOLD);
      text("Selected Woman", boxXLeft + 10, boxYLeft + 10);  // Bold label

      // Reset style and draw normal text
      textStyle(NORMAL);
      let displayTextLeft = noMovieExistsForWoman ? "\nNo movie exists" : 
        `Age ${selectedAge}\nLargest Age Gap: ${largestAgeGapMovieYoungerWoman}\nActors: ${actor1NameYoungerWoman}(${selectedAge}) & ${actor2NameYoungerWoman}(${partnerAgeForLargestGapWoman})`;
      text(displayTextLeft, boxXLeft + 10, boxYLeft + 30, boxWidth - 20);  // Wrapped normal text inside box
    }

    // Display largest age gap movie for the selected man, regardless of younger or older
    if (largestAgeGapMovieYoungerMan !== '' || !noMovieExistsForMan) {
      fill('#a2b6ff');  // Pastel blue background
      stroke(0);  // Black outline
      strokeWeight(2);
      let boxXRight = lineXMen + 100;  // Place it to the right of the graph
      let boxYRight = height / 3;  // Center it vertically
      rect(boxXRight, boxYRight, boxWidth, boxHeight);  // Draw box

      // Bold "Selected Man"
      fill(0);
      noStroke();
      textSize(16);
      textStyle(BOLD);
      text("Selected Man", boxXRight + 10, boxYRight + 10);  // Bold label

      // Reset style and draw normal text
      textStyle(NORMAL);
      let displayTextRight = noMovieExistsForMan ? "\nNo movie exists" : 
        `Age ${selectedAge}\nLargest Age Gap: ${largestAgeGapMovieYoungerMan}\nActors: ${actor1NameYoungerMan}(${selectedAge}) & ${actor2NameYoungerMan}(${partnerAgeForLargestGapMan})`;
      text(displayTextRight, boxXRight + 10, boxYRight + 30, boxWidth - 20);  // Wrapped normal text inside box
    }
  }
}

// Function to find the largest age gap movies for both selected men and women (regardless of age order)
function findLargestAgeGapMovie() {
  let largestGapWoman = 0;
  let largestGapMan = 0;
  noMovieExistsForWoman = true;  // Reset at the beginning
  noMovieExistsForMan = true;    // Reset at the beginning

  for (let key in agePairs) {
    let pair = agePairs[key];
    let ageGap = Math.abs(pair.age1 - pair.age2);

    // Check for selected woman, regardless of whether she's older or younger
    if (pair.age1 === selectedAge && pair.gender1 === 'woman') {
      noMovieExistsForWoman = false;  // Movie exists for selected woman
      if (ageGap > largestGapWoman) {
        largestGapWoman = ageGap;
        largestAgeGapMovieYoungerWoman = pair.movie;
        partnerAgeForLargestGapWoman = pair.age2;  // Store partner's age
        actor1NameYoungerWoman = pair.actor1Name;  // Store actor names
        actor2NameYoungerWoman = pair.actor2Name;
      }
    } else if (pair.age2 === selectedAge && pair.gender2 === 'woman') {
      noMovieExistsForWoman = false;  // Movie exists for selected woman
      if (ageGap > largestGapWoman) {
        largestGapWoman = ageGap;
        largestAgeGapMovieYoungerWoman = pair.movie;
        partnerAgeForLargestGapWoman = pair.age1;
        actor1NameYoungerWoman = pair.actor2Name;
        actor2NameYoungerWoman = pair.actor1Name;
      }
    }

    // Check for selected man, regardless of whether he's older or younger
    if (pair.age1 === selectedAge && pair.gender1 === 'man') {
      noMovieExistsForMan = false;  // Movie exists for selected man
      if (ageGap > largestGapMan) {
        largestGapMan = ageGap;
        largestAgeGapMovieYoungerMan = pair.movie;
        partnerAgeForLargestGapMan = pair.age2;
        actor1NameYoungerMan = pair.actor1Name;
        actor2NameYoungerMan = pair.actor2Name;
      }
    } else if (pair.age2 === selectedAge && pair.gender2 === 'man') {
      noMovieExistsForMan = false;  // Movie exists for selected man
      if (ageGap > largestGapMan) {
        largestGapMan = ageGap;
        largestAgeGapMovieYoungerMan = pair.movie;
        partnerAgeForLargestGapMan = pair.age1;
        actor1NameYoungerMan = pair.actor2Name;
        actor2NameYoungerMan = pair.actor1Name;
      }
    }
  }
}

// Function to draw a vertical line from selected age to partner's age for the largest age gap movies
function drawVerticalLineForLargestGap() {
  // Vertical line for the selected woman
  if (selectedAge !== null && partnerAgeForLargestGapWoman !== null && !noMovieExistsForWoman) {
    let y1Woman = selectedAge <= 100 ? map(selectedAge, 0, 100, height, 0) : height / 2;
    let y2Woman = partnerAgeForLargestGapWoman <= 100 ? map(partnerAgeForLargestGapWoman, 0, 100, height, 0) : height / 2;
    let lineXLeft = lineXWomen - 60;  // Slightly to the left of the graph

    stroke('#FF69B4');  // Pink line for selected woman
    strokeWeight(2);
    line(lineXLeft, y1Woman, lineXLeft, y2Woman);  // Draw vertical line for woman
  }

  // Vertical line for the selected man
  if (selectedAge !== null && partnerAgeForLargestGapMan !== null && !noMovieExistsForMan) {
    let y1Man = selectedAge <= 100 ? map(selectedAge, 0, 100, height, 0) : height / 2;
    let y2Man = partnerAgeForLargestGapMan <= 100 ? map(partnerAgeForLargestGapMan, 0, 100, height, 0) : height / 2;
    let lineXRight = lineXMen + 60;  // Slightly to the right of the graph

    stroke('#1E90FF');  // Blue line for selected man
    strokeWeight(2);
    line(lineXRight, y1Man, lineXRight, y2Man);  // Draw vertical line for man
  }
}

function isHovering(x, y) {
  let d = dist(mouseX, mouseY, x, y);
  return d < 10;
}

function mousePressed() {
  for (let [age, y] of womenAges) {
    if (isHovering(lineXWomen, y)) {
      selectedAge = (selectedAge === age) ? null : age;
      findLargestAgeGapMovie();  // Find the largest age gap movie when a circle is clicked
      redraw();
      return;
    }
  }

  for (let [age, y] of menAges) {
    if (isHovering(lineXMen, y)) {
      selectedAge = (selectedAge === age) ? null : age;
      findLargestAgeGapMovie();  // Find the largest age gap movie when a circle is clicked
      redraw();
      return;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
