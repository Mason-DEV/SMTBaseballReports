const uuid = require("uuid");
const express = require("express");
const router = express.Router();
const devToken = require("../../config/keys").SECERT_JWT;
const axios = require("axios");

//Logger
const logger = require("../../config/logger");
const PdfPrinter = require("pdfmake/src/printer");
const blobStream = require("blob-stream");
const fs = require("fs");
const fonts = {
	Roboto: {
		normal: "routes/documents/fonts/Roboto-Regular.ttf",
		bold: "fonts/Roboto-Medium.ttf",
		italics: "fonts/Roboto-Italic.ttf",
		bolditalics: "fonts/Roboto-MediumItalic.ttf"
	}
};
const printer = new PdfPrinter(fonts);

const pfxFieldHeaders = {
	operator: "Operator",
	venue: "Venue",
	date: "Date",
	firstPitch: "First Pitch",
	logIn: "Log In",
	logOut: "Log Out",
	hwswIssues: "HW/SW Issues",
	t1Notes: "T1 Notes",
	corrections: "Corrections"
};


const getDate = () => {
	var date = new Date();
	var formated = date.toLocaleDateString();
	return formated;
};


const todayData = async () => {
	var data = null;
	await axios.get("/api/pfxTech/todayDaily", {
		 headers: { Authorization: devToken } 
	}).then(res => {
		data = res.data
	}).catch(err => {
		logger.error("Could not get todayData");
		logger.error(err);
})
	return data

};

// @route   Post documents/dailyPfxReportPDF/
// @desc
// @access  Private
router.route("/dailyPfxReportPDF").get(async function(req, res) {
	let id = uuid();
	//Get A Token
	// const token = await devToken();
	// //Get Emails of who we are sending too
	// const today = await todayData(token);
});

// @route   POST documents/testPDF/
// @desc
// @access  Private
router.route("/testPDF").post(async function(req, res) {
	let id = uuid();

	//Here is where we would get the data needed for TODAYS Games and create the array
	var data = [
		{ venue: 'Data', Operator: 'Data', HWSWIssues: 'Data', t1Notes: 'Data' },
		{ venue: 'Data', Operator: 'Data', HWSWIssues: 'Data', t1Notes: 'Data' },
		{ venue: 'Data', Operator: 'Data', HWSWIssues: 'Data', t1Notes: 'Data' },
		
	];


	logger.info(id + " === Requesting Test PFx Daily Summary pdf");
	var docDefinition = {
		pageOrientation: "landscape",
		content: [
			{
				columns: [
					{
						image: "routes/documents/images/SMT_PDF_Logo.jpg",
						fit: [200, 100]
					},
					[
						{
							text: "PITCH F/x PDF REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						},
						{ text: "Daily Summary for  " +getDate(), style: { fontSize: 14,  alignment: "center", margin: [0, 190, 0, 80] } }
					]
				]
			},
			
			{
			table: {
            headerRows: 1,
            widths:  '*',
                body: [
					[ {text: "Venue", style:{ fillColor: "#eeeeee"}}, {text: "Operator", style:{ fillColor: "#eeeeee"}}, {text: "HW/SW Issues", style:{ fillColor: "#eeeeee"}}, {text: "T1 Notes", style:{ fillColor: "#eeeeee"}} ],
                  [ {text: data[0].venue }, {text: data[0].Operator}, {text: data[0].HWSWIssues}, {text: data[0].t1Notes} ],
                  [ {text: data[1].venue }, {text: data[1].Operator}, {text: data[1].HWSWIssues}, {text: data[1].t1Notes} ],
                  [ {text: data[2].venue }, {text: data[2].Operator}, {text: data[2].HWSWIssues}, {text: data[2].t1Notes} ],
                  
                ]
              }
			}
		]
	};


	

	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning Test PFx Daily Summary pdf");
});

// @route   GET documents/PFxDailyPDF/
// @desc
// @access  Private
router.route("/PFxDailyPDF").post(async function(req, res) {
	let id = uuid();
	
	var data = await todayData();
	if(data == null){
		data = [{ venue: 'No Games', operator: "No Games", hwswIssues: 'No Games', t1Notes: 'No Games' }]
	}
	
	logger.info(id + " === Requesting PFX Daily Summary pdf");
	var docDefinition = {
		pageOrientation: "landscape",
		content: [
			{
				columns: [
					{
						image: "routes/documents/images/SMT_PDF_Logo.jpg",
						fit: [200, 100]
					},
					[
						{
							text: "FIELD F/x PDF REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						},
						{ text: "Daily Summary for  " +getDate(), style: { fontSize: 14,  alignment: "center", margin: [0, 190, 0, 80] } }
					]
				]
			},
			{
			table: {
            headerRows: 1,
            widths:  '*',
				body: [[ {text: "Venue", style:{ fillColor: "#eeeeee"}}, {text: "Operator", style:{ fillColor: "#eeeeee"}}, {text: "HW/SW Issues", style:{ fillColor: "#eeeeee"}}, {text: "T1 Notes", style:{ fillColor: "#eeeeee"}} ]]
				.concat(data.map((game, i) => [game.venue, game.operator, game.hwswIssues, game.t1Notes]))
              }
			}
		]
	};
	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	pdfDoc.pipe(res);
	pdfDoc.end();
	logger.info(id + " === Returning PFX Daily Summary pdf");
});

module.exports = router;
