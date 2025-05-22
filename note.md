select 2 dates start and end date to select just the messageries between those dates (AddedDate) 
select all messageries where status is equal to 'غير منجز'
and select only the messageries in this Filieres the IdFiliere is provided from params [id] 
and only the messageries that has the Etude array not empty the last etude is the one that we going to use next 
create api route to fetch them and page for that and it should be 'use client'
when loading stuff do <div>...loading</div>

now what we need to do is create a table using shadcn it should have the pagination and search fields
here are the rows of the table الرقم الترتيبي(NumeroOrdre)  رقم المراسلة(NumeroMessagerie) تاريخ الاجراء(this the dateDecision from the last etude in that messagerie)
نائب الوكيل العام المكلف بالدراسة(this procuros from the last etude also) تاريخ التسجيل(this is the addedDate of the messagerie) الجهة المحال عليها الاجراء(this is source of the last etude of that messagerie) العمر الافتراضي من تاريخ البحث(this is the number of days from the date of hte decision from the last etude to today calculate it ) العمر الافتراضي من تاريخ التسجيل(and this is same thing but just from AddedDate)
and on top of the table give عدد المساطر التي تجاوزت 100 يوم
and 
عدد المساطر التي عمرها الافتراضي أقل من 100  يوم
and 
المجموع
now here is the schema 
give the routes i need to create and the page "use client" you can decide it to componets if you want or just one page
