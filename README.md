# A5 - Michael Raffelsberger

## How to run this
The easiest way is just to run an http server in the directory where the index.html file and also this README are located.
The index.html file will use all the Javascript libraries from the libraries folder, the stylesheets from the static folder and the Javascript files from the vis folder. The vis folder contains all the actual visualization logic and is the place where the three relevant datasets as well as the world_countries.json file (for the map) from the data folder are read in.

## R Part
The original dataset (owid-covid-data.csv) can also be found in the data folder but plays no role when "running" the dashboard. It is however used by some files located in the R folder. I used R to explore the data (see: eda.html) and also plan how to preprocess the data in an ideal way. My thoughts are then incorporated in what is done by the main.R file. That file reads the owid-covid-data.csv as well as the world_countries.json file to prepare the datasets for the dashboard elements. The configurations (file paths, variable names, ...) are taken from the config.R file and the preprocessing functions can be found in the owidcovid R package. Note that in eda.html also the test variables are analyzed. I did not make use of them for the dashboard in the end. They are comparably unclean and also not too central for the tasks of the users I had in mind. Of course, the test rate has some implications on how reliable official infection rates are, but that would open Pandora's box since there are doubtlessly many many details one could consider for the dashboard.

## Documentation
I gave my best to structure and comment everything to make it as comprehensible as possible. In case anything remains unclear, I am happy to answer any questions regarding my implementation.

## References
All references I made use of for the implementation can be found neatly listed at the very end of the code files where they primarily played a role.