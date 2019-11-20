const uuid = require("uuid");
const express = require("express");
const router = express.Router();
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

// @route   GET documents/testPDF/
// @desc
// @access  Public
router.route("/testPDF").post(function(req, res) {
	let id = uuid();
	let fieldsToAdd = [];
	let formatted = [];
	for (let [key, value] of Object.entries(req.body.Fields)) {
		if (value === true) {
			fieldsToAdd.push(key);
		}
	}
	//Format headers
	fieldsToAdd.map((field, idx) => {
		let test = pfxFieldHeaders[field];
		formatted.push(test);
	});

	console.log(formatted);
	//Here is where we would get the data needed for TODAYS Games and create the array
	logger.info(id + " === Requesting Test PFx pdf");
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
						}
					]
				]
			},
			{ text: "PFx Daily Summary for  " + getDate(), style: { fontSize: 16, margin: [0, 10, 0, 5] } },
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
	logger.info(id + " === Returning Test PFx pdf");
});

module.exports = router;
