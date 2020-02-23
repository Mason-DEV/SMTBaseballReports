export default {
	items: [
		{
			name: "Dashboard",
			url: "/dashboard",
            icon: "icon-speedometer",
            permission: ["ffxAuditPermission", "ffxTechPermission", "pfxTechPermission", "ffxAuditDataPermission", "ffxTechDataPermission", "pfxTechDataPermission", "extrasPermission"]
		},
		{
			title: true,
			name: "Reports",
			wrapper: {
				// optional wrapper object
				element: "", // required valid HTML5 element tag
				attributes: {style: {background: 'red'}} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            permission: ["ffxAuditPermission", "ffxTechPermission", "pfxTechPermission"]
			
		},
    {
      name: "FFx Audit Report",
      url: "/ffxauditreport",
	  icon: "icon-note",
	  permission: ["ffxAuditPermission"]
    },
	{
		name: "FFx Tech Report",
		url: "/ffxtechreport",
        icon: "icon-note",
        permission: ["ffxTechPermission"]
	},
	{
		name: "PFx Tech Report",
		url: "/pfxtechreport",
        icon: "icon-note",
        permission: ["pfxTechPermission"]
	},
	{
		title: true,
		name: "Data",
		wrapper: {
			element: "",
			attributes: {}
        },
        permission: ["ffxAuditDataPermission", "ffxTechDataPermission", "pfxTechDataPermission"]
	},
	{
		name: "FFx Audit",
		url: "/ffxauditdata",
        icon: "icon-globe",
        permission: ["ffxAuditDataPermission"]
	},
	{
		name: "FFx Tech",
		url: "/ffxtechdata",
        icon: "icon-globe",
        permission: ["ffxTechDataPermission"]
	},
	{
		name: "PFx Tech",
		url: "/pfxtechdata",
        icon: "icon-globe",
        permission: ["pfxTechDataPermission"]
	},
	{
		title: true,
        name: "Extras",
        permission: ["extrasPermission"]
	},
		{
			name: "Staff",
			url: "/staff",
            icon: "icon-people",
            permission: ["extrasPermission"]
		},
		{
			name: "Venues",
			url: "/venue",
            icon: "icon-location-pin",
            permission: ["extrasPermission"]
		}		
	]
};
