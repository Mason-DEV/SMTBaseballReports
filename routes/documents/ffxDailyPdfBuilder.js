const uuid = require("uuid");
const express = require("express");
const router = express.Router();
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

const ffxFieldHeaders = {
	venue: "Venue",
	operator: "Operator",
	support: "Support",
	bitMode: "Bit Mode",
	gameID: "Game ID",
	gameStatus: "Game Status",
	ipcrIssues: "IPCR Issues",
	fgdIssues: "FGD Issues",
	resolverIssues: "Resolver Issues",
	hardwareIssues: "Hardware Issues",
	miscNotes: "Misc Notes",
	date: "Date ",
	logIn: "Log In",
	logOut: "Log Out",
	firstPitch: "First Pitch",
	supportNotes: "Support Notes",
	bisonSet: "Bison Set",
	backupTask: "Backup Task",
	backupNotes: "Backup Notes"
};

const styleDEF = {
	header: {
		fontSize: 40,
		bold: true
	},
	anotherStyle: {
		italics: true,
		alignment: "right"
	}
};
const printer = new PdfPrinter(fonts);

const getDate = () => {
	var date = new Date();
	var formated = date.toLocaleDateString();
	return formated;
};

const devToken = async () => {
	let token = null;
	await axios.post("http://localhost:5000/getToken", {
		username: "dev",
		//TODO encrypt
		password: "dev"
	}).then(res => {
		token = res.data.token;
	}).catch(err => {
		logger.error("Could not get a Token");
		
	});
	return token
}

const todayData = async (token) => {
	await axios.get("http://localhost:5000/api/pfxTech/today", {
		 headers: { Authorization: `Bearer ${token}` } 
	}).then(res => {
		console.log(res)
	}).catch(err => {
		logger.error("Could not get todayData");
		
	});
	return null
}

// @route   GET documents/testPDF/
// @desc
// @access  Private
router.route("/testPDF").post(async function(req, res) {
	let id = uuid();
	let fieldsToAdd = [];
	let formatted = [];
	//Get A Token
	// const token = await devToken();
	// //Get Emails of who we are sending too
	// const today = await todayData(token);

	for (let [key, value] of Object.entries(req.body.Fields)) {
		if (value === true) {
			fieldsToAdd.push(key);
		}
	}
	//Format headers
	fieldsToAdd.map((field, idx) => {
		let test = ffxFieldHeaders[field];
		console.log(test);
		formatted.push(test);
	});

	//Here is where we would get the data needed for TODAYS Games and create the array
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
							text: "FIELD F/x PDF REPORT PREVIEW",
							style: { fontSize: 18, alignment: "center", margin: [0, 190, 0, 80] }
						}
					]
				]
			},
			{ text: "FFx Daily Summary for  " + getDate(), style: { fontSize: 16, margin: [0, 10, 0, 5] } },
			{
				table: {
					headerRows: 1,
					widths: "*",
					margin: [-50, 2, 10, 20],
					body: [
						//Sets Column Headers
                        formatted.map((field, idx) => {
                            return { fillColor: "#eeeeee", text: field};
                        }),
						//Sets Values
						formatted.map((inning, idx) => {
							return { text: "Data" };
						}),
						formatted.map((inning, idx) => {
							return { text: "Data" };
						}),
						formatted.map((inning, idx) => {
							return { text: "Data" };
						}),
						formatted.map((inning, idx) => {
							return { text: "Data" };
						})
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

module.exports = router;
