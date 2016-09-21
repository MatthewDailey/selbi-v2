
function print_help {
    echo 'Usage: ./runSimulator <stage>'
    echo '  * stage - The Selbi stage to connect to. One of develop, staging or production.'
    echo '            If no stage is provided, will automatically connect to develop.'
}


if [ "$1" = "-h" ]
then
    print_help
    exit 0;
fi

if [ "$1" = "--help" ]
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

echo 'Starting simulator for SELBI_STAGE = DEVELOP'
react-native run-ios --scheme 'Selbi Develop'