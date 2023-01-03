// JavaScript Document

let numberOfDiceOptions = { "minimum":1, "maximum":8, "default":4 };
let difficultyOptions = { "minimum":0, "maximum":8, "default":0  };

// If you increase skill beyond 16, you need to "fix" rollDieVsSkill
let skillOptions = { "minimum":3, "maximum":16, "default":6  }; 

let bruteForceNumber = 1000;

let defaultOptions = [
	{"description": "Summon, Scamp D2 R0",					"dice": 3, 	"skill": 6,		"difficulty": 2 },
	{"description": "Summon, Scamp D4 R0",					"dice": 5, 	"skill": 6,		"difficulty": 3 },
	{"description": "Summon, Scamp D6 R0",					"dice": 7, 	"skill": 6,		"difficulty": 4 },
	{"description": "Summon, Flame Atronarch, D2 R0",		"dice": 5, 	"skill": 6,		"difficulty": 3 },
	{"description": "Summon, Flame Atronarch, D4 R0",		"dice": 7, 	"skill": 6,		"difficulty": 4 }
]

function getBruteForceData()
{
  this.dice = parseInt(document.getElementById("numberOfDice").value, 10);
  this.skill = parseInt(document.getElementById("characterSkill").value, 10);
  this.difficulty = parseInt(document.getElementById("rollDifficulty").value, 10);
  
  this.averageResultRaw = bruteForceAverageRoll(this.skill, this.dice);
  this.averageResult = Number(this.averageResultRaw.toFixed(1));
  
  this.percentageChanceOfAtLeastN_scaled = bruteForcePercentageChance(this.skill, this.dice, this.difficulty);
  this.percentageChanceOfAtLeastN = Number(this.percentageChanceOfAtLeastN_scaled.toFixed(1));
}

function populateResults()
{
    var rawData = new getBruteForceData();
    
    document.getElementById("averageResult").innerHTML = rawData.averageResult;
    document.getElementById("percentageChance").innerHTML = rawData.percentageChanceOfAtLeastN;
}

function setupDefaultSelections()
{
	var defaultSelectBox = document.getElementById("defaultSelectID");	
	for (let currentOption = 0; currentOption < defaultOptions.length; currentOption++)
	{
		var newOption = new Option(defaultOptions[currentOption].description, currentOption);
		defaultSelectBox.add(newOption, undefined);
	}
	defaultSelectBox.value = -1;
	
	var diceSelectBox = document.getElementById("numberOfDice");	
	for (let currentValue = numberOfDiceOptions.minimum; currentValue <= numberOfDiceOptions.maximum; currentValue++)
	{
		var newOption = new Option(currentValue, currentValue);
		diceSelectBox.add(newOption, undefined);
	}
	diceSelectBox.value = numberOfDiceOptions.default;
	
	var skillSelectBox = document.getElementById("characterSkill");	
	for (let currentValue = skillOptions.minimum; currentValue <= skillOptions.maximum; currentValue++)
	{
		var newOption = new Option(currentValue, currentValue);
		skillSelectBox.add(newOption, undefined);
	}
	skillSelectBox.value = skillOptions.default;
	
	var difficultySelectBox = document.getElementById("rollDifficulty");	
	for (let currentValue = difficultyOptions.minimum; currentValue <= difficultyOptions.maximum; currentValue++)
	{
		var newOption = new Option(currentValue, currentValue);
		difficultySelectBox.add(newOption, undefined);
	}
	difficultySelectBox.value = difficultyOptions.default;
}

function applyDefaults()
{
	var selectedRow = parseInt(document.getElementById("defaultSelectID").value, 10);
	
	if (selectedRow < defaultOptions.length)
	{
		document.getElementById("numberOfDice").value = defaultOptions[selectedRow].dice;
		document.getElementById("characterSkill").value = defaultOptions[selectedRow].skill;
		document.getElementById("rollDifficulty").value = defaultOptions[selectedRow].difficulty;
		populateResults();
	
	}
	else
	{
		console.log("Error, Value from Select box out of range of array!");
	}
}

function bodyLoad()
{
	setupDefaultSelections();
	
	populateResults();
  
	currentTestFunction();
}

function randomIntFromInterval(min, max)
{
  var returnValue = 1;
  returnValue = Math.floor(Math.random()*(max-min+1)+min);
  //console.log("Random Number in Range " + min + " to " + max + " of " + returnValue);
  return returnValue;
}

function rollDie()
{
  var dieResult = randomIntFromInterval(1, 10);
  //console.log("dieResult: " + dieResult);
  
  var returnValue = dieResult;
  //console.log("returnValue: " + returnValue);
  
  //console.log("final returnValue: " + returnValue);
  return returnValue;
}

function rollDieVsSkill(skill)
{
	var diceResult = rollDie();
	var returnValue = 0;
	
	if (diceResult <= 8)
	{
		if (skill <= 8 && diceResult <= skill)
		{
			returnValue = 1;
		}
		else
		{
			if (diceResult <= (skill - 8))
			{
				returnValue = 2;
			}
			else if (diceResult <= skill)
			{
				returnValue = 1;
			}
		}
	}

	//console.log("--> Skill of : " + skill + " and I rolled : " + diceResult + " so I got : " + returnValue + " sucesses.");
	return returnValue;
}

function rollSkill(skill, dice)
{
	var cumilativeResult = 0;
	
	for (let currentDie = 1; currentDie <= dice; currentDie++)
	{
		cumilativeResult += rollDieVsSkill(skill);
	}
	
	//console.log("Combined this gives : " + cumilativeResult + " against a skill of : " + skill + " with : " + dice + " rolled.");
	return cumilativeResult;
}

function bruteForceAverageRoll(skill, dice)
{
	var cumilativeResult = 0;
	var averageResult = 0;
	for (let currentDie = 1; currentDie <= bruteForceNumber; currentDie++)
	{
		cumilativeResult += rollSkill(skill, dice);
	}
	averageResult = cumilativeResult / bruteForceNumber;
	
	//console.log("Rolling : " + bruteForceNumber + " times gives an average roll of : " + averageResult);
	return averageResult;
}

function bruteForcePercentageChance(skill, dice, difficulty)
{
	var cumilativeResult = 0;
	var percentageChance = 0;
	
	for (let currentDie = 1; currentDie <= bruteForceNumber; currentDie++)
	{
		var skillCheckResult = rollSkill(skill, dice);
		
		if (skillCheckResult >= difficulty)
		{
			cumilativeResult++;
		}
	}
	
	percentageChance = cumilativeResult / bruteForceNumber * 100;
	
	//console.log("out of rolling : " + bruteForceNumber + " times : " + cumilativeResult + " where a sucesses giving a percentage of : " + percentageChance + "%");
	return percentageChance;
}

function currentTestFunction()
{
	
}




