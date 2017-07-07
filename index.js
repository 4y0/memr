#!/usr/bin/env node
var program = require('commander'); 
var nc = require('node-cmd');
var commandAlias;
 


//Store in jsonfile 
var localStorage = {};
try{

	var _JSONLocation = require('path').join(__dirname, 'storage/_.json');
	localStorage = require(_JSONLocation);
}
catch(e){
	
	if(~e.message.indexOf('Cannot find module')){
		require('fs').writeFileSync(_JSONLocation, JSON.stringify({}));
	}

}

function getStorage(){

	return localStorage;

}


function updateStorage(updatedStorage){

	require('fs').writeFileSync(_JSONLocation, JSON.stringify(updatedStorage));

}

/*
Coercion essentially means, 
taking return value of the 
func and replacing program.add with it
*/

program
  .version('0.0.0')
  .option('-a, --add <vnmn>', 'Add a command to remember with an optional key to fetch it')
  .option('-l, --list', 'List all stored commands')
  .option('-c, --clear', 'List all stored commands')
  .option('-x, --noexec', 'List all stored commands')
  .parse(process.argv);

//Store a new command
if(program.add){

	var localStorage = getStorage();
	var file_rem_key = program.args[0];
	console.log(localStorage, file_rem_key, " for command ", program.add);
	if(file_rem_key){
		localStorage[file_rem_key] = program.add;
	}

	//persist to file
	updateStorage(localStorage);

}


//List all stored commands
if(program.list){

	var localStorage = getStorage();
	for(item in localStorage){
		console.log('Key: ', item, ' Command: ', localStorage[item], ' run: memr ', item);
	}

}


if(program.clear){
	updateStorage({});
}
	
function processReplacements(command, args){

	var subst_regex = /(\{[a-z0-9]+\})/ig;
	var placeholders = command.match(subst_regex);

	if(args.length > 1 && placeholders){

		placeholders
		.forEach(

			function (p, i){
				if(args[i + 1]){
					var replacement = args[i + 1];
					if(/\s/.test(replacement)){
						replacement = '"' + replacement + '"';
					}
					command = command.replace(p, replacement);	
				}
				
			}
		)

	}
	return command;
}

//get single command
if(!program.list && !program.clear && !program.add){

	console.log(program.args);
	var file_rem_key = program.args[0];
	if(file_rem_key && getStorage()[file_rem_key.trim()] ){

		var command_to_recall = getStorage()[file_rem_key]; 

		command_to_recall = (processReplacements(command_to_recall, program.args));
		if(program.noexec){
			console.log(command_to_recall);
		}
		else{
			//nc.run(command_to_recall);
			console.log("==== Running command: ", command_to_recall, " ====");
			nc.get(command_to_recall, function (err, data, stderr){
				console.log(data);
			});
		}
	}
	else{
		console.log('No MEMR entry with the key', file_rem_key);
	}

}

//memr -a "git log admin" logadmin
