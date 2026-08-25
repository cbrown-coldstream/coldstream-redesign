// THE TEAM — Jon, Greg and Tyler, ported from the live about pages (owner brief 2026-08-25:
// "take the profiles from the live site", "same info and image"). Bios are the live site's own
// copy, verbatim except for typographic quotes; photos keep their live filenames for provenance,
// served as avif/webp/jpg from public/photos/team/. Roles read off the live pages' own alt text
// and bio copy ("founding Coldstream Exteriors", "co-owns ... St. Louis location", "Co-Owner ...
// Columbus"). `markets` drives which about pages show whom — the brief: national all three,
// Cincinnati Jon, Columbus Jon and Tyler. St. Louis was not in the brief; Greg renders there the
// day someone says so, by adding "st-louis" to his list.
export const TEAM = [
  {
    name: "Jon Davis",
    role: "Founder",
    home: "Cincinnati",
    markets: ["cincinnati", "columbus"],
    photo: { base: "Jon-and-Emma-1024x768_11zon-1", w: 640, h: 480, alt: "Jon Davis, founder of Coldstream Exteriors" },
    bio: "From flipping houses to fund his college education to founding Coldstream Exteriors, Jon Davis has turned his passion for transforming homes into a lifelong mission in Cincinnati. With 17 years in residential construction, Jon's love for instant transformation drives him to create those \"wow\" moments that happen when a home gets a fresh new look. A lifelong Cincinnati resident, he's built Coldstream Exteriors on the cornerstones of faith, family, and exceptional craftsmanship – values that shine through in everything from their Ronald McDonald House volunteer work to the way they treat each customer's home. When he's not helping his team master the latest industry innovations or perfecting a client's siding project, you might find Jon on the golf course, where he says the game teaches him the same patience and strategic thinking that helps him lead Coldstream Exteriors to new heights.",
  },
  {
    name: "Greg Morse",
    role: "Co-Owner",
    home: "St. Louis",
    markets: [],
    photo: { base: "rvrv_11zon-1", w: 504, h: 792, alt: "Greg Morse, co-owner of Coldstream Exteriors St. Louis" },
    bio: "A St. Louis native with a passion for bringing homes back to life, Greg Morse found his calling in exterior renovations after seeing how much joy a well-executed home improvement project could bring to families. With 16 years of industry experience, Greg co-owns Coldstream Exteriors' St. Louis location where he's built a company culture that puts honesty and fairness first – values he learned growing up in the very communities he now serves. His fascination with historic homes and classic cars spills into his work, giving him a unique appreciation for both timeless craftsmanship and modern innovation. When he's not helping homeowners transform their properties or mentoring his team, you'll find Greg spending time with his wife and two children, who remind him daily that building trust is just as important as building great exteriors.",
  },
  {
    name: "Tyler Brooks",
    role: "Co-Owner",
    home: "Columbus",
    markets: ["columbus"],
    photo: { base: "Tyler-Brooks-1024x768_11zon-1", w: 640, h: 480, alt: "Tyler Brooks, co-owner of Coldstream Exteriors Columbus" },
    bio: "Growing up alongside his father tackling home projects, Tyler Brooks learned early on that there's something special about completing a project with your own hands. Now leading Coldstream Exteriors' Columbus location, he brings that same hands-on dedication and \"do right\" philosophy from his days coaching high school baseball to every home renovation project. Recently making Columbus his home in 2024, Tyler has already fallen in love with the city's vibrant energy and growing communities, seeing endless possibilities in the booming housing market. When he's not helping transform homes with stunning siding projects or giving back through Children's Hospital initiatives, you might find Tyler on a local golf course learning patience from the game's challenges, or exploring Columbus's neighborhoods with his family and their dogs – adventures that he says keep him grounded in what matters most: faith, family, and community service.",
  },
];

export const teamFor = (slug) => TEAM.filter((t) => t.markets.includes(slug));
