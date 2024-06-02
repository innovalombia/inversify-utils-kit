const VALID_GIT = [
    ':bookmark:',
    ':whale:',
    ':tada:',
    ':pencil:',
    ':rocket:',
    ':boom:',
    ':hammer:',
    ':construction:',
    ':zap:',
    ':sparkles:',
    ':recycle:',
    ':bug:',
    ':ambulance:',
    ':lipstick:',
    ':lock:',
    ':arrow_down:',
    ':arrow_up:',
    ':pushpin:',
    ':chart_with_upwards_trend:',
    ':heavy_plus_sign:',
    ':heavy_minus_sign:',
    ':wrench:',
    ':globe_with_meridians:',
    ':pencil2:',
    ':rewind:',
    ':package:',
    ':alien:',
    ':bento:',
    ':wheelchair:',
    ':speech_balloon:',
    ':card_file_box:',
    ':children_crossing:',
    ':iphone:',
    ':egg:',
    ':alembic:',
    ':mag:',
    ':label:',
    ':triangular_flag_on_post:',
    ':goal_net:',
    ':dizzy:',
    ':wastebasket:',
    ':passport_control:',
    ':adhesive_bandage:',
    ':necktie:'
];

module.exports = {
    rules: {
        'version-rule': [2, 'always']
    },
    plugins: [
        {
            rules: {
                'version-rule': ({ header = '' }) => {
                    const pass = VALID_GIT.some((item) =>
                        header.startsWith(item)
                    );

                    return [
                        pass,
                        `Your commit should be start with some string ${VALID_GIT.join(
                            ', '
                        )} message`
                    ];
                }
            }
        }
    ]
};
