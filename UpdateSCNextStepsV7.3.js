// ==UserScript==
// @name         SC Next Step Updater v7.3
// @namespace    http://tampermonkey.net/
// @version      7.3
// @description  Update SC Next Steps in Quip. This to have well structured text field which can be used for analytics.
// @author       Jeroen M.
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to get today's date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Function to create the popup
    function createPopup(event, data) {
        // Get today's date
        const today = getTodayDate();

        // Create and show the popup
        let popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = event.pageX + 'px';
        popup.style.top = event.pageY + 'px';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '5px';
        popup.style.zIndex = '1000';
        popup.style.width = '400px';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        popup.style.borderRadius = '8px';
        popup.style.maxHeight = '60vh'; // Set the max height
        popup.style.overflowY = 'auto'; // Add vertical scroll if content exceeds max height

        // Create the drag handle
        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '&#10021;'; // Unicode for drag  icon
        dragHandle.style.cursor = 'move';
        dragHandle.style.position = 'absolute';
        dragHandle.style.top = '5px';
        dragHandle.style.left = '5px';
        dragHandle.style.fontSize = '20px';
        dragHandle.style.color = '#888';
        // Create the form inside the popup
        popup.innerHTML = `
            <style>
            .popup-container {
                --primary-color: #FF4F1F;
                --secondary-color: black;
                --text-color: #333;
                --background-color: #FFFFFF;
                --light-gray: #F4F4F4;
            }
            .genesysForm {
                font-family: 'Roboto', Arial, sans-serif;
                background-color: var(--background-color);
                color: var(--text-color);
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 400px;
                margin: 0 auto;
                padding: 5px;
            }
            form {
                background-color: var(--light-gray);
                padding: 5px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            label {
                display: inline-block;
                margin-top: 5px;
                width: 180px;
                font-size: 12px;
                color: var(--secondary-color);
            }
            .columnsCheck{
                display: inline-block;
                margin-top: 5px;
                width: 160px;
                font-size: 12px;
                color: var(--secondary-color);
            }
            .NextStepUpdateGen {
                background-color: #2E0D5F;
                color: #FFFFFF;
                font-size: 18px;
                text-align: center;
                display: inline-block;
                width: 85%;
                border-radius: 4px;
            }
            .LeftSpace {
                display: inline-block;
                width: 10%;
            }
            input[type="date"], select, input[type="text"], textarea {
                display: inline-block;
                width: 180px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 11px;
                background-color: white;
            }
            input[type="checkbox"]{
                transform: scale(0.8);
            }
            button {
                background-color: #FF4F1F;
                color: white;
                padding: 6px 10px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                margin-top: 5px;
                font-size: 11px;
            }
            button:hover {
                background-color: #FF4F1F;
            }
            .language-list {
                height: 80px;
                overflow: -moz-scrollbars-vertical;
                overflow-y: scroll;
                border: 1px solid #ddd;
                padding: 2px;
                background-color: white;
                border-radius: 4px;
            }
            #generatedOutput {
                margin-top: 5px;
                padding:7px;
                border: 1px solid #ddd;
                background-color: white;
                border-radius: 4px;
                height: 100px;
                overflow: -moz-scrollbars-vertical;
                overflow-y: scroll;
            }
            #languageSupportCSS {
                height: 80px;
                overflow: -moz-scrollbars-vertical;
                overflow-y: scroll;
                border: 1px solid #ddd;
                padding: 2px;
                background-color: white;
                border-radius: 4px;
            }
            .colorclass {
                background-color: white;
                margin-top: 5px;
            }
            .notesSection{
                background-color: white;
                display: block;
                width: 100%;
                height: 80px;
                overflow: -moz-scrollbars-vertical;
                overflow-y: scroll;
            }

            </style>
            <div class="popup-container">
                <form id="genesysForm">
                    <label class="LeftSpace"></label>
                    <label class="NextStepUpdateGen">SC Next Steps Update Generator</label>
                    <label for="todayDate">Today's Date:</label>
                    <input type="date" id="todayDate" value="${today}" required>

                    <label for="SCName">SC Name:</label>
                    <input type="text" id="SCName" value="${data.SCName || ''}" required>

                    <label for="presalesStatus">Presales Activity Status:</label>
                    <select class="colorclass" id="presalesStatus" required>
                        <option value="WIP" ${data.presalesStatus === 'WIP' ? 'selected' : ''}>WIP</option>
                        <option value="Completed" ${data.presalesStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="SC Not Required" ${data.presalesStatus === 'SC Not Required' ? 'selected' : ''}>SC Not Required</option>
                        <option value="SC Not Yet Engaged" ${data.presalesStatus === 'SC Not Yet Engaged' ? 'selected' : ''}>SC Not Yet Engaged</option>
                        <option value="On-Hold" ${data.presalesStatus === 'On-Hold' ? 'selected' : ''}>On-Hold</option>
                    </select>

                    <label for="targetCompletionDate">Target Completion Date:</label>
                    <input type="date" id="targetCompletionDate" value="${data.targetCompletionDate || ''}" required>

                    <label for="rfp">RFP:</label>
                    <select class="colorclass" id="rfp" required>
                        <option value="N/A" ${data.rfp === 'N/A' ? 'selected' : ''}>N/A</option>
                        <option value="Waiting for" ${data.rfp === 'Waiting for' ? 'selected' : ''}>Waiting for</option>
                        <option value="In Progress" ${data.rfp === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Submitted" ${data.rfp === 'Submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="Next Stage" ${data.rfp === 'Next Stage' ? 'selected' : ''}>Next Stage</option>
                        <option value="Awarded" ${data.rfp === 'Awarded' ? 'selected' : ''}>Awarded</option>
                        <option value="Lost" ${data.rfp === 'Lost' ? 'selected' : ''}>Lost</option>
                    </select>

                    <label for="languageRisk">Language Risk:</label>
                    <select class="colorclass" id="languageRisk" required>
                        <option value="Yes" ${data.languageRisk === 'Yes' ? 'selected' : ''}>Yes</option>
                        <option value="No" ${data.languageRisk === 'No' ? 'selected' : ''}>No</option>
                    </select>

                    <label>Languages Required:</label>
                    <div class="language-list" id="languagesRequired">${['English', 'French', 'Walloon', 'German', 'Spanish', 'Catalan', 'Basque', 'Galician', 'Italian', 'Arabic', 'Hebrew', 'Russian', 'Turkish', 'Greek', 'Polish', 'Romanian', 'Dutch', 'Flemish', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Portuguese', 'Czech', 'Slovak', 'Hungarian', 'Bulgarian', 'Croatian', 'Serbian', 'Slovenian', 'Albanian', 'Macedonian', 'Bosnian', 'Estonian', 'Latvian', 'Lithuanian', 'Ukrainian', 'Belarusian', 'Georgian', 'Armenian', 'Azerbaijani', 'Kazakh', 'Uzbek', 'Turkmen', 'Kyrgyz', 'Tajik'].map(lang => `<label class="columnsCheck"><input type="checkbox" name="languagesRequired" value="${lang}" ${data.languagesRequired.includes(lang) ? 'checked' : ''}>${lang}</label>`).join('')}</div>

                    <label>Language Support:</label>
                    <div id="languageSupportCSS">
                    <div id="languageSupport">
                        ${[
                            "Predictive Engagement",
                            "Predictive Routing",
                            "Knowledge Workbench",
                            "Knowledge Portal",
                            "Knowledge Optimizer",
                            "Agent Assist Knowledge Surfacing (Digital)",
                            "Agent Assist Knowledge Surfacing (Voice)",
                            "Agent Copilot",
                            "Auto-Summarization (Digital)",
                            "Auto-Summarization (Voice)",
                            "Conversational Voice Bots",
                            "Conversational Digital Bots",
                            "Intent Miner",
                            "STA - Topic Miner",
                            "STA - Topic Detection",
                            "STA - Voice Transcription",
                            "STA - Customer Sentiment and Agent Empathy",
                            "Genesys Cloud UI"
                        ].map(lang => `
                            <label class="columnsCheck"><input type="checkbox" name="languageSupport" value="${lang}" ${data.languageSupport.includes(lang) ? 'checked' : ''}> ${lang}</label>
                        `).join('')}
                    </div>
                    </div>

                    <label for="notes">Notes:</label>
                    <textarea class="notesSection" id="notes" rows="4">${today}:<update here> \n${data.notes ? data.notes.join('\n') : ''}</textarea>

                    <button type="button" id="generateButton">Generate + Copy to clipboard</button>
                <!--
                </form>
                <form id="genesysForm">
                <label for="OutputCopy">Generated Output to be copied to Quip</label>
                <div id="generatedOutput" contenteditable="false"></div>
                <button id="copyButton">Copy to Clipboard</button>
                </form>
                -->
            </div>
        `;
        // Add the drag handle to the popup
        popup.insertBefore(dragHandle, popup.firstChild);
        document.body.appendChild(popup);

    // Handle popup movement
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragHandle.addEventListener('mousedown', dragStart, true);
    document.addEventListener('mouseup', dragEnd, true);
    document.addEventListener('mousemove', drag, true);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, popup);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

        // Remove the popup when clicking anywhere outside it
        document.addEventListener('click', function() {
            popup.remove();
        }, { once: true });

        // Stop propagation to allow clicking inside the popup
        popup.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        // Add event listener for the Generate button
        document.getElementById('generateButton').addEventListener('click', function() {
            let updatedData = {
                todayDate: document.getElementById('todayDate').value,
                SCName: document.getElementById('SCName').value,
                presalesStatus: document.getElementById('presalesStatus').value,
                targetCompletionDate: document.getElementById('targetCompletionDate').value,
                rfp: document.getElementById('rfp').value,
                languageRisk: document.getElementById('languageRisk').value,
                languagesRequired: Array.from(document.querySelectorAll('#languagesRequired input[type="checkbox"]:checked')).map(el => el.value),
                languageSupport: Array.from(document.querySelectorAll('#languageSupport input[type="checkbox"]:checked')).map(el => el.value),
                notes: document.getElementById('notes').value ? document.getElementById('notes').value.split('\n') : []
            };

            let generatedText = `
                ${updatedData.todayDate} Update:${updatedData.SCName}, Presales ${updatedData.presalesStatus}, TCD: ${updatedData.targetCompletionDate}, RFP: ${updatedData.rfp}, Language Risk: ${updatedData.languageRisk}, Languages Required: ${updatedData.languagesRequired}, Language Support: ${updatedData.languageSupport.join(', ')}, Notes: ${updatedData.notes.join('\n            ')}`;
            //navigator.clipboard.writeText(generatedText.trim());
            let trimmedText = generatedText.trim();
            let tempTextArea = document.createElement("textarea");
            // Set its value to the trimmed content
            tempTextArea.value = trimmedText;
            // Append it to the body
            document.body.appendChild(tempTextArea);
            // Select the text
            tempTextArea.select();

            // Copy the selected text
            document.execCommand("copy");

            // Remove the temporary element
            document.body.removeChild(tempTextArea);
            alert('Copied to clipboard');
            //document.getElementById('generatedOutput').innerText = generatedText.trim();

        });

        // Add event listener for the Copy to Clipboard button
        /*
        document.getElementById('copyButton').addEventListener('click', function() {
            let outputText = document.getElementById('generatedOutput').innerText;
            let textarea = document.createElement('textarea');
            textarea.value = outputText.trim();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Copied to clipboard');
        });
        */
    }

    // Function to parse selected text
    function parseSelectedText(selectedText) {
        let data = {
            todayDate: '',
            SCName: '',
            presalesStatus: '',
            targetCompletionDate: '',
            rfp: '',
            languageRisk: '',
            languagesRequired: [],
            languageSupport: [],
            notes: []
        };

        let regex = /(\d{4}-\d{2}-\d{2}) Update:(.*?), Presales (.*?), TCD: (.*?), RFP: (.*?), Language Risk: (.*?), Languages Required: (.*?), Language Support: (.*?), Notes: ([\s\S]*)/;
        let match = regex.exec(selectedText);

        if (match) {
            data.todayDate = match[1] || '';
            data.SCName = match[2] || '';
            data.presalesStatus = match[3] || '';
            data.targetCompletionDate = match[4] || '';
            data.rfp = match[5] || '';
            data.languageRisk = match[6] || '';
            data.languagesRequired = match[7] ? match[7].split(',').map(s => s.trim()) : [];
            data.languageSupport = match[8] ? match[8].split(',').map(s => s.trim()) : [];
            data.notes = match[9] ? match[9].split('\n').map(s => s.trim()) : [];
        }

        return data;
    }

    // Create a context menu item
    document.addEventListener('contextmenu', function(event) {
        let selectedText = window.getSelection().toString().trim();
        let selection = window.getSelection();
        let range = selection.rangeCount ? selection.getRangeAt(0) : null;

        if (selectedText.length > 0) {
            // Prevent the default context menu from appearing
            event.preventDefault();

            // Parse the selected text
            let data = parseSelectedText(selectedText);
            data.range = range;
            data.isEmptyForm = false;

            createPopup(event, data);
        } else {
            // Show an empty form if no text is selected
            event.preventDefault();
            createPopup(event, { isEmptyForm: true, todayDate: getTodayDate() });
        }
    });
})();