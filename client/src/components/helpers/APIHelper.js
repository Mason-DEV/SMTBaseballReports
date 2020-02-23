//API URL Helper
//Used to get the ability to dynamiclly change the api call urls site-wide


export default {
    //User APIs
    getUserAPI : "/getUser",
    getTokenAPI: "/getToken",
    //Audit APIs
    getFFxAuditAPI: "/api/FFxAudit/",
    getFFxAuditReportByIdAPI :"/api/FFxAudit/ffxReportByID",
    createFFxAuditReportAPI: "/api/FFxAudit/create",
    updateFFxAuditReportAPI: "/api/FFxAudit/update/",
    deleteFFxAuditReportByIdAPI: "/api/FFxAudit/delete/",
    //FFx Tech APIs
    getFFxTechAPI: "/api/FFxTech/",
    getFFxTechTodayAPI: "/api/FFxTech/today",
    getFFxTechReportByIDAPI: "/api/ffxTech/ffxReportByID",
    updateFFxTechReportAPI: "/api/ffxTech/update/",
    deleteFFxTechReportAPI: "/api/FFxTech/delete/",
    createFFxTechReportAPI: "/api/ffxTech/create",
    //PFx Tech APIs
    getPFXTechAPI: "/api/PFxTech/",
    getPFXTechTodayAPI: "/api/PFxTech/today",
    getPFxTechReportAPI: "/api/pfxTech/pfxReportByID",
    updatePFxTechReportAPI: "/api/pfxTech/update/",
    deletePFxTechReportAPI: "/api/PFxTech/delete/",
    createPFxTechReportAPI: "/api/PFxTech/create/",
    //Staff APIs
    getStaffAPI: "/api/staff/",
    createStaffAPI: "/api/staff/create/",
    getStaffByIdAPI: "/api/staff/staffByID",
    updateStaffAPI: "/api/staff/update/",
    deleteStaffAPI: "/api/staff/delete/",
    getFFxStaffAPI: "/api/staff/ffxOperators",
    getPFxStaffAPI: "/api/staff/pfxOperators",
    getAuditStaffAPI: "/api/staff/auditors",
    getSupportStaffAPI: "/api/staff/support",
    getOPsStaffAPI: "/api/staff/operators",
    //Settings APIs
    getSettingsOPAnnounceAPI: "/api/settings/opAnnouncement",
    getSettingsSupportAnnounceAPI: "/api/settings/supportAnnouncement",
    updateSettingsPFxDailyAPI: "/api/settings/updatePFxDaily/",
    updateSettingsAnnouncementAPI: "/api/settings/updateAnnouncement/",
    getSettingsPFxDailyEmailAPI: "/api/settings/pfxDailyEmail",
    getSettingsFFxDailyEmailAPI: "/api/settings/ffxDailyEmail",
    //Venue APIs
    getVenueAPI: "/api/venue/",
    getFFxVenuesAPI: "/api/venue/fieldFx",
    getPfxVenuesAPI: "/api/venue/pitchFx",
    createVenueAPI: "/api/venue/create/",
    updateVenueAPI: "/api/venue/update/",
    deleteVenueAPI: "/api/venue/delete/",
    getVenueByIdAPI: "/api/venue/venueByID",
    //PDF APIs
    buildTestPFxDailyPDFAPI: "/api/pfxDailyPdfBuilder/testPDF",
    //Logger API
    loggerAPI: "/api/logger"
    
}