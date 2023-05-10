function getAnimationDuration(element, transition = false)
{
    const style = getComputedStyle(element);

    const ruleBase = { false: "animation", true: "transition" }[transition];
    const master = { false: "Name", true: "Property" }[transition];

    const limit = style[ruleBase + master].split(",").length;

    const rules = [ "Duration", "Delay" ].map(x => style[ruleBase + x].split(",").slice(0, limit).map(s =>
    {
        let mut = 1000;
        s = s.replace("s", "");
        return parseFloat(s.trim()) * mut;
    }));

    var pattern = rules[1],
        target  = rules[0];
    if (rules[0].length < rules[1].length)
    {
        pattern = rules[0];
        target  = rules[1];
    }

    var object = Object.fromEntries(pattern.map(x => [ x, [] ]));
    for (let i = 0; i < target.length; i++)
    {
        object[pattern[i % pattern.length]].push(target[i]);
    }

    const a = pattern.sort((a, b) => a - b)[pattern.length - 1],
          b = object[a].sort((a, b) => a - b)[object[a].length - 1];

    return a + b;
}
