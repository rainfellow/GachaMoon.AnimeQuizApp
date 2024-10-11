export function getAgeRatingTitle(rating: string)
{
    switch(rating) { 
        case "pg_13": { 
          return "AgeRatingPG13"
        } 
        case "pg": { 
          return "AgeRatingPG"
        } 
        case "g": { 
          return "AgeRatingG"
        } 
        case "none": { 
          return "NotAvailableShort"
        } 
        case "r": { 
          return "AgeRatingR"
        } 
        case "r+": { 
          return "AgeRatingRPlus"
        } 
        case "rx": { 
          return "AgeRatingRx"
        } 
        default: { 
          return ""
        } 
     } 
}