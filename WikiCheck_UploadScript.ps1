function backupVersion{

	#Copy pre-update version number to .txt file
	Set-Content -Path $previousVersionPath -Value $versionStringMajor
	Add-Content -Path $previousVersionPath -Value $versionStringMinor
	Add-Content -Path $previousVersionPath -Value $versionStringPatch

}

function concArchivePath($verMajor, $verMinor, $verPatch){

	return '.\WikiCheck\' + $date + '_' + 'WikiCheck_' + $verMajor + '_' + $verMinor + '_' + $verPatch

}

function serverUp($serverIP){

	#Check if target server is online
	if (Test-Connection $serverIP -Quiet) {
		return 'true'
	} return 'false'
}

function compressFiles(){

	#Compress all files in declared path to the same folder
	Compress-Archive -Path $extensionPath* -CompressionLevel Fastest -DestinationPath $concPath 
}

function cleanUpZIP(){

	#Remove compressed ZIP archive/s after failed upload
	Remove-Item -Path .\WikiCheck\*.zip

}

function uploadChanges(){
	
	#Get login details from user
	$inputUsername = Read-Host -Prompt 'Input SSH username'
	$inputServerIP = Read-Host -Prompt 'Input SSH server IP'
	$inputSecurePwd = Read-Host -Prompt 'Input SSH password' -AsSecureString

	#Convert encrypted password to string
	$inputPlainPwd =[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($inputSecurePwd))
	
	if(serverUp $inputServerIP -eq 'true'){

		#Assign Path of ZIP file on remote Server
		$archiveTargetPath = $inputServerIP + ':' + '/public_html/wikicheck/versionManagement/'

		#Upload archive to preconfigured remote path $archiveTargetPath
		Write-Output n | pscp -pw $inputPlainPwd $zipSourcePath $inputUsername@$archiveTargetPath
	
	} else{

		#Write Error Messages in case the connectivity check with host fails
		Write-Host 'Upload Failed - Cannot reach host'
		Write-Host 'Please check the IP-adress you provided'
		Write-Host 'Avoid repeating the update version with the parameter "uploadOnly"'
	
	}
}

function archiveChanges(){

	Move-Item $zipSourcePath -Destination $archiveFolder

}

function updateMajorVersion(){

	#Write Changes to WikiCheckVersion.txt
	Set-Content -Path $versionPath -Value $versionNewMajor
	Add-Content -Path $versionPath -Value $versionNewMinor
	Add-Content -Path $versionPath -Value $versionNewPatch
	
}

function updateMinorVersion(){

	Set-Content -Path $versionPath -Value $versionNewMajor
	Add-Content -Path $versionPath -Value $versionNewMinor
	Add-Content -Path $versionPath -Value $versionNewPatch

}

function updatePatchVersion(){

	Set-Content -Path $versionPath -Value $versionNewMajor
	Add-Content -Path $versionPath -Value $versionNewMinor
	Add-Content -Path $versionPath -Value $versionNewPatch

}

#Gets current Date
$date = Get-Date -Format "yyMMdd"

#Assign path of archive folder
$archiveFolder = '.\WikiCheckArchive\'

#Assign Path of extension folder
$extensionPath = '.\WikiCheck\'

#Assign Path of WikiCheckVerstion.txt to variable
$versionPath = '.\WikiCheck\WikiCheckVersion.txt'

#Assign Path of last version to variable
$previousVersionPath = '.\WikiCheck\WikiCheckPreviousVersion.txt'

#Get content of WikiCheckVersion.txt
$versionArray = Get-Content -Path $versionPath

$versionStringMajor = $versionArray[0]
$versionStringMinor = $versionArray[1]
$versionStringPatch = $versionArray[2]

#Cast Strings to Integers
$versionMajor = [int]$versionStringMajor
$versionMinor = [int]$versionStringMinor
$versionPatch = [int]$versionStringPatch

$updateType = Read-Host -Prompt 'Please choose your update type ["major"|"minor"|"patch"|"uploadOnly"]'
$upload = Read-Host -Prompt 'Would you like to upload your File? ["y"|"n"]'
$archive = Read-Host -Prompt 'Would you like to archive your File? ["y"|"n"] `r ATTENTION `r File will be automatically archived if you: `r 1) choose the cleanup option `r 2) dont upload'
$cleanup = Read-Host -Prompt 'Would you like to remove the created file after upload? ["y"|"n"]'

if($updateType -eq "major"){

	backupVersion

	$versionNewMajor = $versionMajor +1
	$versionNewMinor = 0
	$versionNewPatch = 0

	#Concatenate the path of the resulting archive
	#following the format below
	#
	# .\WikiCheck\234059_WikiCheck_1.0.1_191113
	# .\<extensionFolder>\<randomNr>_<extensionName>_<major>.<minor>.<patch>_<YYMMDD>
	#
	$concPath = concArchivePath $versionNewMajor $versionNewMinor $versionNewPatch

	$zipSourcePath = $concPath + '.zip'

	updateMajorVersion	

	compressFiles

	if($upload = 'y'){

		uploadChanges

	}

	if(($archive -eq 'y') -or ($upload -eq 'n') -or ($cleanup -eq 'y')){

		archiveChanges

	}

	if($cleanup -eq 'y'){

		cleanUpZIP

	}
		
}elseif($updateType -eq "minor"){

	backupVersion

	#Set new Minor Version
	#Leave Major unchanged, Set Path to 0
	$versionNewMajor = $versionMajor
	$versionNewMinor = $versionMinor + 1
	$versionNewPatch = 0

	#Concatenate the path of the resulting archive
	#following the format below
	#
	# .\WikiCheck\234059_WikiCheck_1.0.1_191113
	# .\<extensionFolder>\<randomNr>_<extensionName>_<major>.<minor>.<patch>_<YYMMDD>
	#
	$concPath = concArchivePath $versionNewMajor $versionNewMinor $versionNewPatch

	$zipSourcePath = $concPath + '.zip'

	updateMinorVersion
	
	compressFiles

	if($upload = 'y'){

		uploadChanges

	}

	if(($archive -eq 'y') -or ($upload -eq 'n') -or ($cleanup -eq 'y')){

		archiveChanges

	}

	if($cleanup = 'y'){

		cleanUpZIP

	}

}elseif($updateType -eq "patch"){

	backupVersion

	#Set new Patch Version
	#Leave ajor and Minor unchanged
	$versionNewMajor = $versionMajor
	$versionNewMinor = $versionMinor
	$versionNewPatch = $versionPatch + 1

	#Concatenate the path of the resulting archive
	#following the format below
	#
	# .\WikiCheck\234059_WikiCheck_1.0.1_191113
	# .\<extensionFolder>\<randomNr>_<extensionName>_<major>.<minor>.<patch>_<YYMMDD>
	#
	$concPath = concArchivePath $versionNewMajor $versionNewMinor $versionNewPatch

	$zipSourcePath = $concPath + '.zip'

	updatePatchVersion

	compressFiles

	if($upload -eq 'y'){

		uploadChanges

	}

	if(($archive -eq 'y') -or ($upload -eq 'n') -or ($cleanup -eq 'y')){

		archiveChanges

	}

	if($cleanup = 'y'){

		cleanUpZIP

	}

}elseif($updateType -eq 'uploadOnly'){

	cleanUpZIP

	compressFiles

	uploadChanges

	if($cleanup = 'y'){

		cleanUpZIP

	}

}else{
	Write-Host 'Error'
}
