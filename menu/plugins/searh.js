
var krpanoplugin = function()
{
	var local = this;

	var krpano = null;
	var plugin = null;
	
	var inputelement = null;

	local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
	{
		krpano = krpanointerface;
		plugin = pluginobject;

		inputelement = document.createElement("input");
		inputelement.type = "text";
		
		inputelement.style.width  = "93%";
		inputelement.style.height = "110%";
		inputelement.style.fontSize = "12px"
		inputelement.style.padding = "2px 2px 2px 10px"
		inputelement.style.backgroundColor = "#eeeeee"
		inputelement.style.color = "#555555"
		inputelement.style.borderColor = "#777777"
		inputelement.style.borderWidth = "0px"
		inputelement.style.borderRadius = "10px"
		inputelement.style.outline = "none"
		inputelement.placeholder = "" 
		
 
		
		plugin.registerattribute("textSM", "", text_set, text_get);
		plugin.registerattribute("onchanged", null);
		
		inputelement.addEventListener("change", text_changed, true);

		plugin.sprite.appendChild(inputelement);
		
		inputelement.addEventListener("mousedown", function(e){ e.stopPropagation(); }, true);

	}

	local.unloadplugin = function()
	{
		plugin = null;
		krpano = null;
	}
	
	function text_set(newtext)
	{
		inputelement.value = newtext;
	}
	
	function text_get()
	{
		return inputelement.value;
	}
	
	function text_changed()
	{
		krpano.call(plugin.onchanged, plugin);
	}
	
	
};

