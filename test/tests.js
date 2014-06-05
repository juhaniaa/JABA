test("Veckodagar", function(){
    var indata = new Date(2014, 04, 29);
    
    JABA.Calendar.getWeekDates(indata)
    
    ok(JABA.Calendar.daysOfWeek[0].year === "2014" == true, "Måndag rätt år");
    ok(JABA.Calendar.daysOfWeek[0].month === "05" == true, "Måndag rätt månad");
    ok(JABA.Calendar.daysOfWeek[0].day === "26" == true, "Måndag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[1].year === "2014" == true, "Tisdag rätt år");
    ok(JABA.Calendar.daysOfWeek[1].month === "05" == true, "Tisdag rätt månad");
    ok(JABA.Calendar.daysOfWeek[1].day === "27" == true, "Tisdag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[2].year === "2014" == true, "Onsdag rätt år");
    ok(JABA.Calendar.daysOfWeek[2].month === "05" == true, "Onsdag rätt månad");
    ok(JABA.Calendar.daysOfWeek[2].day === "28" == true, "Onsdag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[3].year === "2014" == true, "Torsdag rätt år");
    ok(JABA.Calendar.daysOfWeek[3].month === "05" == true, "Torsdag rätt månad");
    ok(JABA.Calendar.daysOfWeek[3].day === "29" == true, "Torsdag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[4].year === "2014" == true, "Fredag rätt år");
    ok(JABA.Calendar.daysOfWeek[4].month === "05" == true, "Fredag rätt månad");
    ok(JABA.Calendar.daysOfWeek[4].day === "30" == true, "Fredag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[5].year === "2014" == true, "Lördag rätt år");
    ok(JABA.Calendar.daysOfWeek[5].month === "05" == true, "Lördag rätt månad");
    ok(JABA.Calendar.daysOfWeek[5].day === "31" == true, "Lördag rätt dag");
    
    ok(JABA.Calendar.daysOfWeek[6].year === "2014" == true, "Söndag rätt år");
    ok(JABA.Calendar.daysOfWeek[6].month === "06" == true, "Söndag rätt månad");
    ok(JABA.Calendar.daysOfWeek[6].day === "01" == true, "Söndag rätt dag");
    
    
});

test("Mode ändring", function(){
    JABA.Calendar.setMode("Week");
    ok(JABA.Calendar.mode === "Week", "Ändring till vecka");
    JABA.Calendar.setMode("Month");
    ok(JABA.Calendar.mode === "Month", "Ändring till månad");
});

test("hello test", function(){
    ok(1 == "1", "Passed!");
});
