function getBotResponse(input) {
    //rock paper scissors
    input = input.toLowerCase()

    if (input == "college" ) {
        return "Choose B.Tech, MBA, MBBS and LAW";
    } 

    else if (input == "b.tech") {
        return "Choose IITS NITS IIITS";
    } 

    else if (input == "iits" || input == "iit") {
        return "IIT Madras, IIT Delhi, IIT Bombay, IIT Kharagpur, IIT Kanpur"
    }

    else if (input == "nits" || input == "nit") {
        return "NIT Tiruchirappalli, NIT Rourkela, NIT Surathkal, NIT Warangal, NIT Calicut"
    }

    else if (input == "iiits" || input == "iiit") {
        return "IIIT Hyderabad, IIIT Bangalore, IIIT Jabalpur, IIT Gwalior, IIIT Allahabad"
    }
    
    else if (input == "mba") {
        return "Choose IIM, Government MBA";
    } 
    
    else if (input == "iim") {
        return "IIM Bangalore, IIM Ahmedabad, IIM Kolkata, IIM Lucknow, IIM Indore";
    } 

    else if (input == "govt mba"  || input == "government mba" || input == "govt. mba") {
        return "SPSU Udaipur, SJIM Bangalore, PIMR Indore, DMS Delhi";
    } 
    
    
   
    else if (input == "mbbs") {
        return "Choose AIIMS, Government MBBS";
    } 

    else if (input == "aiims") {
        return "AIIMS Delhi, AIIMS Jodhpur, AIIMS Raipur, AIIMS Patna, AIIMS Bhopal";
    } 

    else if (input == "govt mbbs"  || input == "government mbbs" || input == "govt. mbbs") {
        return "MMC Chennai, IPGMER Kolkata, AMU Aligarh, MAMC Delhi";
    } 

    else if (input == "law") {
        return "NLSIU Bangalore, NLU New Delhi, MIT-WPU Pune, NALSAR Hyderabad";
    } 
    else if (input == "cutoff" ) {
        return "Choose B.Tech, MBA, MBBS and LAW";
    } 

    else if (input == "cutoff" ) {
        return "Choose B.Tech cutoff, MBA cutoff, MBBS cutoff";
    } 
    else if (input == "b.tech cutoff") {
        return "Choose JEE MAIN, JEE ADVANCED";
    } 
    else if (input == "jee main") {
        return "GEN - 100 , OBC - 78, ST - 40, SC - 35";
    } 
    
    else if (input == "jee advanced") {
        return "GEN - 70 , OBC - 52, ST - 30, SC - 25";
    } 

    else if (input == "mba cutoff") {
        return "IIM Ahmedabad 85, IIM Bangalore	85, IIM Calcutta 85, IIM Lucknow 90";
    } 
    else if (input == "mbbs cutoff") {
        return "Chose NEET cutoff";
    } 

    else if (input == "mbbs cutoff") {
        return "GEN - 370 , OBC - 352, ST - 230, SC - 125";
    } 
    
    



    // Simple responses
    if (input == "hello") {
        return "How May Help You!";
    } else if ( input == "goodbye"  || input == "bye") {
        return "Talk to you later!";
    }
    else if (input == "hi") {
        return "How May Help You!";
    }
    else if (input == "ok") {
        return "Thank you!";
    }
     else {
        return "How May Help You!";
    }
}