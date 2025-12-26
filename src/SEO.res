// SEO.res - SEO analysis and recommendations
// Uses SeoParserImpl (pure ReScript implementation)

@genType
type metaTag = SeoParserImpl.metaTag

@genType
type seoIssue = {
  severity: string,
  message: string,
  element: option<string>,
}

@genType
type seoData = SeoParserImpl.seoData

@genType
type seoResult = {
  data: seoData,
  issues: array<seoIssue>,
  score: float,
}

// Helper function to calculate SEO score
let calculateScore = (data: seoData, issues: array<seoIssue>): float => {
  let score = ref(100.0)

  // Deduct points for issues
  issues->Array.forEach(issue => {
    switch issue.severity {
    | "error" => score := score.contents -. 10.0
    | "warning" => score := score.contents -. 5.0
    | "info" => score := score.contents -. 2.0
    | _ => ()
    }
  })

  // Bonus points for good practices
  if data.structuredData {
    score := score.contents +. 5.0
  }

  if Dict.toArray(data.ogTags)->Array.length > 0 {
    score := score.contents +. 3.0
  }

  if data.wordCount > 1000 {
    score := score.contents +. 5.0
  }

  let finalScore = score.contents
  if finalScore < 0.0 {
    0.0
  } else if finalScore > 100.0 {
    100.0
  } else {
    finalScore
  }
}

@genType
let analyze = async (html: string, url: string): seoResult => {
  let data = await SeoParserImpl.analyzeSEO(html, url)
  let issues: array<seoIssue> = []

  // Check title
  switch data.title {
  | None => {
      Array.push(issues, {
        severity: "error",
        message: "Missing page title (<title> tag)",
        element: None,
      })->ignore
    }
  | Some(title) => {
      let titleLength = String.length(title)
      if titleLength < 30 {
        Array.push(issues, {
          severity: "warning",
          message: `Title is too short (${Int.toString(titleLength)} chars). Recommended: 30-60 characters.`,
          element: Some(`<title>${title}</title>`),
        })->ignore
      } else if titleLength > 60 {
        Array.push(issues, {
          severity: "warning",
          message: `Title is too long (${Int.toString(titleLength)} chars). Recommended: 30-60 characters.`,
          element: Some(`<title>${title}</title>`),
        })->ignore
      }
    }
  }

  // Check meta description
  switch data.description {
  | None => {
      Array.push(issues, {
        severity: "error",
        message: "Missing meta description",
        element: None,
      })->ignore
    }
  | Some(desc) => {
      let descLength = String.length(desc)
      if descLength < 120 {
        Array.push(issues, {
          severity: "warning",
          message: `Meta description is too short (${Int.toString(descLength)} chars). Recommended: 120-160 characters.`,
          element: Some(`<meta name="description" content="${desc}">`),
        })->ignore
      } else if descLength > 160 {
        Array.push(issues, {
          severity: "info",
          message: `Meta description is too long (${Int.toString(descLength)} chars). May be truncated in search results.`,
          element: Some(`<meta name="description" content="${desc}">`),
        })->ignore
      }
    }
  }

  // Check headings
  let h1Count = Dict.get(data.headings, "h1")->Option.map(Array.length)->Option.getOr(0)
  if h1Count === 0 {
    Array.push(issues, {
      severity: "error",
      message: "Missing H1 heading",
      element: None,
    })->ignore
  } else if h1Count > 1 {
    Array.push(issues, {
      severity: "warning",
      message: `Multiple H1 headings found (${Int.toString(h1Count)}). Use only one H1 per page.`,
      element: None,
    })->ignore
  }

  // Check images with alt text
  if data.images > 0 {
    let percentWithAlt = Float.fromInt(data.imagesWithAlt) /. Float.fromInt(data.images) *. 100.0
    if percentWithAlt < 100.0 {
      let missing = data.images - data.imagesWithAlt
      Array.push(issues, {
        severity: "warning",
        message: `${Int.toString(missing)} images missing alt text (${Float.toFixed(percentWithAlt, ~digits=1)}% have alt text)`,
        element: None,
      })->ignore
    }
  }

  // Check canonical URL
  switch data.canonical {
  | None => {
      Array.push(issues, {
        severity: "info",
        message: "No canonical URL specified",
        element: None,
      })->ignore
    }
  | Some(_) => ()
  }

  // Check Open Graph tags
  if Dict.toArray(data.ogTags)->Array.length === 0 {
    Array.push(issues, {
      severity: "info",
      message: "No Open Graph tags found. Add OG tags for better social media sharing.",
      element: None,
    })->ignore
  }

  // Check structured data
  if !data.structuredData {
    Array.push(issues, {
      severity: "info",
      message: "No structured data (JSON-LD) found. Consider adding schema.org markup.",
      element: None,
    })->ignore
  }

  // Check viewport meta tag
  switch data.viewport {
  | None => {
      Array.push(issues, {
        severity: "warning",
        message: "Missing viewport meta tag for mobile responsiveness",
        element: None,
      })->ignore
    }
  | Some(_) => ()
  }

  // Check language attribute
  switch data.lang {
  | None => {
      Array.push(issues, {
        severity: "warning",
        message: "Missing lang attribute on <html> tag",
        element: None,
      })->ignore
    }
  | Some(_) => ()
  }

  // Check content length
  if data.wordCount < 300 {
    Array.push(issues, {
      severity: "warning",
      message: `Low word count (${Int.toString(data.wordCount)} words). Pages with more content tend to rank better.`,
      element: None,
    })->ignore
  }

  let score = calculateScore(data, issues)

  {
    data,
    issues,
    score,
  }
}

@genType
let filterIssuesBySeverity = (issues: array<seoIssue>, severity: string): array<seoIssue> => {
  issues->Array.filter(issue => issue.severity === severity)
}

@genType
let getIssueCount = (issues: array<seoIssue>): Dict.t<int> => {
  let counts = Dict.make()
  Dict.set(counts, "error", 0)
  Dict.set(counts, "warning", 0)
  Dict.set(counts, "info", 0)

  issues->Array.forEach(issue => {
    let current = Dict.get(counts, issue.severity)->Option.getOr(0)
    Dict.set(counts, issue.severity, current + 1)
  })

  counts
}
