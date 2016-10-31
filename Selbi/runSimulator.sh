#!/usr/bin/env bash

function print_help {
    echo 'Usage: ./runSimulator <stage>'
    echo '  * stage - The Selbi stage to connect to. One of develop, staging or production.'
    echo '            If no stage is provided, will automatically connect to individual.'
}

if [[ ( "$1" = "-h" ) || ( "$1" = "--help" ) ]]
then
    print_help
    exit 0;
fi

if [[ "$1" = "staging" ]]
then
    echo 'Starting simulator for SELBI_STAGE = STAGING'

    react-native run-ios --scheme 'Selbi Staging'
    exit 0
fi

if [[ "$1" = "production" ]]
then
    echo 'Starting simulator for SELBI_STAGE = PRODUCTION'

    react-native run-ios --scheme 'Selbi Production'
    exit 0
fi

if [[ "$1" = "develop" ]]
then
    echo 'Starting simulator for SELBI_STAGE = DEVELOP'

    react-native run-ios --scheme 'Selbi Develop'
    exit 0
fi


numTodosInIndividualConfig=`grep 'TODO' selbiBuildResources/individual/config.js | wc -l`
if [[ $numTodosInIndividualConfig -eq 0 ]]
then
    echo 'Starting simulator for SELBI_STAGE = INDIVIDUAL'

    react-native run-ios --scheme 'Selbi Individual'
    exit 0
else
    echo -------------------------------------------------------------------------------------
    echo Failed to start simulator for Selbi Individual scheme!
    echo
    echo It appears you have not completely set up selbiBuildResources/individual/config.js.
    echo Fix all TODOs and try again.
    echo
    echo You can read more about setting up your development environment at https://github.com/MatthewDailey/selbi-v2
    echo -------------------------------------------------------------------------------------
    exit 1
fi