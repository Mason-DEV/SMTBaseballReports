export default {
	items: [
		{
			name: "Dashboard",
			url: "/dashboard",
			icon: "icon-speedometer"
		},
		{
			title: true,
			name: "Reports",
			wrapper: {
				// optional wrapper object
				element: "", // required valid HTML5 element tag
				attributes: {} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
			},
			class: "" // optional class names space delimited list for title item ex: "text-center"
		},
    {
      name: "FFx Audit Report",
      url: "/ffxauditreport",
      icon: "icon-note"
    },
		{
			name: "FFx Tech Report",
			url: "/theme/colors",
			icon: "icon-note"
		},
		{
			name: "PFx Tech Report",
			url: "/theme/typography",
			icon: "icon-note"
		},
		{
			title: true,
			name: "Data",
			wrapper: {
				element: "",
				attributes: {}
			}
		},
		{
			name: "FFx Audit",
			url: "/ffxauditdata",
			icon: "icon-globe"
		},
		{
			name: "FFx Tech",
			url: "/base",
			icon: "icon-globe"
		},
		{
			name: "PFx Tech",
			url: "/base",
			icon: "icon-globe"
		},
    
		{
			divider: true
		},
		{
			title: true,
			name: "Extras"
		},
		{
			name: "Users",
			url: "/pages",
			icon: "icon-people",
			children: [
				{
					name: "Operators",
					url: "/login",
					icon: "icon-user"
				},
				{
					name: "Support",
					url: "/register",
					icon: "icon-user"
				},
				{
					name: "Auditors",
					url: "/404",
					icon: "icon-user"
				}
			]
		},
		{
			name: "Daily Summaries",
			url: "/404",
			icon: "icon-list"
		}
	]
};
