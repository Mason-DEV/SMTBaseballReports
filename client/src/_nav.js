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
				attributes: {style: {background: 'red'}} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
			},
			class: "" // optional class names space delimited list for title item ex: "text-center"
		},
    {
      name: "FFx Audit Report",
      url: "/ffxauditreport",
	  icon: "icon-note",
	  attributes:{
		//   style:{background: 'black'}
	  }
    },
	{
		name: "FFx Tech Report",
		url: "/ffxtechreport",
		icon: "icon-note"
	},
	{
		name: "PFx Tech Report",
		url: "/pfxtechreport",
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
			name: "Staff",
			url: "/staff",
			icon: "icon-people",
		},
		{
			name: "Venues",
			url: "/venue",
			icon: "icon-location-pin",
		},
		{
			name: "Daily Summaries",
			url: "/404",
			icon: "icon-list"
		}
	]
};
