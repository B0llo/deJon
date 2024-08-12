$text = Get-Content -Path .\template.txt
$events = Get-Content -Raw ..\data\events.json | ConvertFrom-Json
foreach($object in $events) {
    $filePath = (($object.name.ToLower() -replace ' ', '_') )
    New-Item -ItemType "directory" -Path $filePath
    $filePath = $filePath + "/index.html"
    New-Item -ItemType "file" -Path $filePath
   foreach($line in $text) {

        $line = $line -replace '\[event\-name\]', $object.name
        $line = $line -replace '\[event\-date\]', $object.date
        $line = $line -replace '\[event\-location\]', $object.location
        $line = $line -replace '\[event\-description\]', $object.description
        
        Add-Content $filePath $line
    }
}