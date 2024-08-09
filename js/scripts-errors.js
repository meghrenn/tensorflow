document.addEventListener('DOMContentLoaded', function () {
  // Tracking user progress and checking passwords
  var currentPage = document.body.getAttribute("data-page-id");
  var currentGroup = document.body.getAttribute("data-group-id");

  // Retrieve the 'gameProgress' from local storage and parse it as JSON
  var gameProgress = JSON.parse(localStorage.getItem('gameProgress'));

  // If 'gameProgress' doesn't exist or is not an array, initialize a new array with the index page
  if (!Array.isArray(gameProgress)) {
    gameProgress = [{ pageId: "index", groupId: "index-group" }];
  } else {
    // If 'gameProgress' exists and is an array, but it's empty, initialize it with the index page
    if (gameProgress.length === 0) {
      gameProgress.push({ pageId: "index", groupId: "index-group" });
    }
  }

  // Check if the current page and group combination already exists in the gameProgress array
  var pageExists = gameProgress.some(function (page) {
    return page.pageId === currentPage && page.groupId === currentGroup;
  });

  // If the current page and group combination does not exist, add it to the gameProgress array
  if (!pageExists) {
    gameProgress.push({ pageId: currentPage, groupId: currentGroup });
  }

  console.log(gameProgress);
  localStorage.setItem('gameProgress', JSON.stringify(gameProgress));

  // Create and append the progress list
  function createProgressList() {
    var progressListElement = document.getElementById("progress-list");

    // Clear existing list to avoid duplication
    if (progressListElement) {
      progressListElement.innerHTML = '';

      // Create an unordered list
      var ul = document.createElement("ul");

      // Iterate through gameProgress and create list items with links
      gameProgress.forEach(function (page) {
        var li = document.createElement("li");
        var link = document.createElement("a");

        // Set the link href based on the pageId and groupId
        link.href = '../' + page.groupId + '/' + page.pageId + ".html";

        // Set the link text content
        link.textContent = page.pageId;

        // Append the link to the list item
        li.appendChild(link);

        // Append the list item to the unordered list
        ul.appendChild(li);
      });

      // Append the unordered list to the progress list element
      progressListElement.appendChild(ul);
    } else {
      console.error('Element with id "progress-list" not found.');
    }
  }

  createProgressList(); // Create the list when the page loads

  // Fetch header.html and initialize header related functionality
  if (document.querySelector('#main-header')) {
    fetch('../header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        var headerContainer = document.getElementById('header-container');

        if (headerContainer) {
          headerContainer.innerHTML = data;

          // Initialize variables and event listeners here, after content is loaded
          let canHeaderHide = true;

          // Making a scroll-responsive header
          let prevScrollPos = window.pageYOffset;
          window.onscroll = function () {
            if (canHeaderHide) {
              const currentScrollPos = window.pageYOffset;
              if (prevScrollPos > currentScrollPos) {
                document.getElementById("main-header").style.top = "0";
              } else {
                document.getElementById("main-header").style.top = "-55px";
              }
              prevScrollPos = currentScrollPos;
            }
          };

          // Opening and closing pop-up tabs, animating buttons
          var closeButtons = document.querySelectorAll('.close-button');
          var headerHeight = document.querySelector('header').offsetHeight;
          var audio = new Audio('../audio/click-tear.wav');
          audio.volume = 0.7;

          document.getElementById("about").addEventListener('click', function () {
            audio.play();
            document.getElementById("help-page").style.top = "-100%";
            document.getElementById("progress-page").style.top = "-100%";
            document.getElementById("about-page").style.top = headerHeight + 'px';
          });

          document.getElementById("help").addEventListener('click', function () {
            audio.play();
            document.getElementById("about-page").style.top = "-100%";
            document.getElementById("progress-page").style.top = "-100%";
            document.getElementById("help-page").style.top = headerHeight + 'px';
          });

          document.getElementById("progress").addEventL













          // //Track player's use of hints
          // localStorage.removeItem('hintUse');
          // // reset progress
          // document.addEventListener("DOMContentLoaded", function () {

          //   if (document.getElementById("hint-parent") !== null || document.body.getAttribute("data-page-id") === "initiation") {

          //     var hintUse = JSON.parse(localStorage.getItem('hintUse')) || [];
          //     var currentPage = document.body.getAttribute("data-page-id");
          //     var clueTexts = document.querySelectorAll(".clue-text");

          //     function noteHintUse(elementId) {
          //       // Get the existing hintUse array from localStorage or initialize it if it doesn't exist

          //       // Push the data of the clicked element and currentPage to the hintUse array
          //       hintUse.push({ elementId: elementId, currentPage: currentPage });

          //       // Update the hintUse array in localStorage
          //       localStorage.setItem('hintUse', JSON.stringify(hintUse));
          //     }

          //     document.getElementById("hint1").addEventListener("click", function () {
          //       clueTexts.forEach(function (clue) {
          //         clue.classList.add("bold");
          //       });
          //       document.getElementById("hint1").classList.add("helpful");
          //       noteHintUse("hint1");
          //     });

          //     document.getElementById("hint2").addEventListener("click", function () {
          //       document.getElementById("clue2").classList.remove("hidden");
          //       document.getElementById("hint2").classList.add("helpful");
          //       noteHintUse("hint2")
          //       // Smoothly scroll to the bottom of the page
          //       window.scrollTo({
          //         top: document.body.scrollHeight,
          //         behavior: 'smooth'
          //       });
          //     });

          //     document.getElementById("hint3").addEventListener("click", function () {
          //       document.getElementById("clue3").classList.remove("hidden");
          //       document.getElementById("hint3").classList.add("helpful");
          //       noteHintUse("hint3");
          //       // Smoothly scroll to the bottom of the page
          //       window.scrollTo({
          //         top: document.body.scrollHeight,
          //         behavior: 'smooth'
          //       });
          //     });
          //   }
          // });

          // // Update hintUse in localStorage before leaving the page
          // window.addEventListener('beforeunload', function () {
          //   if (document.getElementById("hint-parent") !== null) {
          //     // Update the hintUse array in localStorage
          //     localStorage.setItem('hintUse', JSON.stringify(hintUse));
          //   }
          // });


















          //Check passwords
          var pageNextStep = {
            "initiation": "luck",
            "head": "origins",
            "tail": "origins",
            "fog": "architect",
            "architect": "collapse",
            "future": "congrats",
            "goodbye": "../monster/fear",
            "collapse": "../begin/origins",
            "explanation": "../begin/initiation",
            "secret-stairs": "logo",
            "encroaching-end": "aperture",
            "aperture": "the-end",
          };
          var correctNextStep = pageNextStep[currentPage];

          var pagePasswords = {
            "initiation": "l",
            "file": "placeholder",
            "architect": "river",
            "future": "2267",
            "lettuce": "200",
            "goodbye": "fear",
            "secret-stairs": "coy",
            "encroaching-end": "aperture",
          };
          var correctPassword = pagePasswords[currentPage];

          var pageAlerts = {
            "initiation": "Not what I was looking for. Looks like you're still learning how to play, eh?",
            "architect": "That's not right. Don't put words in my mouth that I haven't asked for.",
            "encroaching-end": "i Am PrEtty suRe thaT yoU'RE wrong. try again",
          }
          var correctAlert = pageAlerts[currentPage];

          function success() {
            puzzleSolved = true;
            document.body.style.backgroundColor = 'var(--green-dark)';
            document.getElementById("main-header").style.backgroundColor = 'var(--green-medium)';
            setTimeout(function () {
              document.body.style.backgroundColor = '';
              document.getElementById("main-header").style.backgroundColor = '';
              window.location.href = correctNextStep + ".html";
            }, 700);
          }

          function failure() {

            document.body.style.backgroundColor = 'var(--red-dark)';
            document.getElementById("main-header").style.backgroundColor = 'var(--red-medium)';
            setTimeout(function () {
              alert(correctAlert);
              document.body.style.backgroundColor = '';
              document.getElementById("main-header").style.backgroundColor = '';
            }, 500);
          }


          if (document.getElementById("my-form") !== null) {
            document.getElementById("my-form").addEventListener("submit", function (event) {
              console.log(currentPage);
              console.log(correctPassword);
              event.preventDefault();
              var enteredPassword = document.getElementById("file-pass").value;
              if (enteredPassword === correctPassword) {
                success();
              } else {
                failure();
              }
            });
          }
        })


    var buttons = document.querySelectorAll('.button');

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        button.classList.add('active');
        if (button.getAttribute('type') === 'submit') {
          var audio = new Audio('../audio/click2.mp3');
          audio.volume = 0.7;
          audio.play();
        } else {
          var audio = new Audio('../audio/click1.mp3');
          audio.volume = 0.7;
          audio.play();
        }
        setTimeout(function () {
          button.classList.remove('active');
        }, 250);
      });
    });