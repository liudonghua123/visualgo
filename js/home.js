$( document ).ready(function() {
	//training and test links
	$('.right-links').css('background',surpriseColour);
	$('#test-link').hide();
	$('#ans-link').hide();
	$.ajax({
		url: "php/Test.php?mode="+MODE_CHECK_TEST_OPEN
	}).done(function(data) {
		data = JSON.parse(data);
		if(data.testIsOpen == 1) {
			$('#test-link').show();
		}
		if(data.answerIsOpen == 1) {
			$('#ans-link').show();
		}
	});
	
	//thumbnail image animation on hover	
	$('a.thumbnail').hover(function() {
		$(this).children('img.static').hide();
	}, function() {
		$(this).children('img.static').show();
	});
	
	//tags
	var sssp = new Array("sssp", "shortest path", "cs2020", "cs2010", "bellman ford", "dijkstra", "single source shortest path", "graphs");
	var sorting = new Array("sorting", "cs2020", "cs1020", "array", "list", "data structure");
	var bitmask = new Array("bitmask", "bit manipulation", "cs3233", "cs2020", "cs2010", "array", "list", "data structure", "set");
	var linked = new Array("linked", "list", "stack", "queue", "cs2020", "cs1020", "array", "data structure");
	var bst = new Array("bst", "binary search tree", "adelson velskii landis", "avl", "table", "cs2020", "cs2010", "recursion", "recursive", "data structure", "set"); 
	var heap = new Array("heap", "binary heap", "priority queue", "cs2020", "cs2010", "recursion", "recursive", "data structure");
	var union = new Array("union", "union find disjoint sets", "ufds", "cs3233", "cs2020", "cs2010", "array", "tree", "set");
	var graphs = new Array("graphs", "tree", "cs2010", "cs2020");
	var mst = new Array("mst", "tree", "min", "spanning", "cs2020", "cs2010");
	var traversal = new Array("traversal", "graphs", "bfs", "dfs", "cs2010", "cs2020");
	var suffixtree = new Array("suffixtree", "tree");
	var suffixarray = new Array("suffixarray", "array");
	var geometry = new Array("geometry", "polygon", "graham scan");
	var recursion = new Array("recursion", "tree", "cs1010", "recursive", "dynamic programming");
	
	var allViz = new Array(sssp, sorting, bitmask, linked, bst, heap, union, graphs, mst, traversal,suffixtree,suffixarray,geometry, recursion);
	
	//generate tags
	function createFilters() {
		var filterList = new Array();
		for(var i=0; i<allViz.length; i++) {
			var thisVizTags = allViz[i];
			for(var j=0; j<thisVizTags.length; j++) {
				//for all filters
				if($.inArray(thisVizTags[j],filterList) == -1) {
					filterList.push(thisVizTags[j]);
				}
				//for individual viz filters
				$('#'+thisVizTags[0]+" .indv-viz-filters").append("<span class='filter'>"+thisVizTags[j]+"</span>");
			}
		}
		filterList.sort();
		for(var i=0; i<filterList.length; i++) {
			$('#filters').append("<span class='filter'>"+ filterList[i] +"</span>");
		}
	}
	createFilters();
	
	//tag and search mechanism
	$('#filters-and-lines').hide();
	$('#emptySearchMsg').hide();
	var isEmptySearch = true;
	var searchTerm = new Array(""); //index 0 is the value from the search bar. Indices 1+ are values from tags.
	
	//search/unsearch from tag filters
	$('.filter').click(function() {
		//add value to search
		searchTerm[searchTerm.length] = $(this).html();
		showResults();
		$('#active-tags').append('<div class="active-tag">'+ $(this).html() +'<img src="img/cross_white.png"/></div>');
		$('.active-tag img').unbind('click').bind('click', function() {
			//remove value from search
			var indexToRemove = searchTerm.indexOf($(this).parent().text());
			searchTerm.splice(indexToRemove,1);
			showResults();
			//visual
			$(this).parent().remove();
		});
	});
		
	//instant search from search bar
	$('#search').each(function() {
		// Save current value of element
		$(this).data('oldVal', $(this));
		
		// Look for changes in the value
		$(this).bind("propertychange keyup input paste", function(event){
			// If value has changed...
			if ($(this).data('oldVal') != $(this).val()) {
				// Updated stored value
				$(this).data('oldVal', $(this).val());
				searchTerm[0] = $(this).val();
				showResults();
			}
		});
	});
	$('#searchbar').submit(function() {
		return false;
	});
	
	//find vizs with tag searchTerm
	function showResults() {
		isEmptySearch = true;
		$('#emptySearchMsg').hide();
		$('.viz').hide();
		for(var i=0; i<allViz.length; i++) { //for each visualisation
			var thisVizTags = allViz[i]; //array of the tags this visualisation has
			var foundAll = true;
			for(var j=0; j<searchTerm.length; j++) { //for each search term
				foundAll = foundAll && findOneTag(searchTerm[j], thisVizTags);
			}
			if(foundAll) {
				$('#'+thisVizTags[0]).show();
				isEmptySearch = false;
			}
		}
		if(isEmptySearch) {
			$('#emptySearchMsg').show();
		}
	}
	
	function findOneTag(tag, vizArr) {
		var found = false;
		for(var i=0; i<vizArr.length; i++) {
			var patt = new RegExp(tag, "i");
			if(patt.test(vizArr[i])) {
				found = true;
			}
		}
		return found;
	}
	
	//styling - arrow rotation, show filters-and-lines
	$("#show-filters").click(function(){
		if ($("#filters-and-lines").is(":hidden")){
			showFilters();
		} else{
			hideFilters();
		}
	});
	
	function showFilters() {
		$("#filters-and-lines").slideDown("slow");
		$("#show-filters img").addClass('rotateRight');
	}
	function hideFilters() {
		$("#filters-and-lines").slideUp("slow");
		$("#show-filters img").removeClass('rotateRight');
	}
	
	//styling - surprise colour stuff
	$('#search').focus(function() { //search inset box-shadow
		if($(this).val().trim() == "Search...") {
			$(this).val("");
		}
		$(this).css("box-shadow", "0px 0px 3px "+surpriseColour+" inset");
		$(this).css("color", "black");
	});
	$('#search').focusout(function() {
		if($(this).val().trim() == "") {
			$(this).val("Search...");
			$(this).css("box-shadow", "0px 0px 3px #929292 inset");
			$(this).css("color", "#888888");
		}
	});
	$('#show-filters').css("background-color", surpriseColour); //search filter button background
	$('#temp a').css("background-color", surpriseColour); //link to old site button
	$('.filter').css("background-color", "#aaaaaa"); //filter tags on hover
		$('.filter').hover(function() {
			$(this).css("background-color", surpriseColour);
		}, function() {
			$(this).css("background-color", "#aaaaaa");
		});
});