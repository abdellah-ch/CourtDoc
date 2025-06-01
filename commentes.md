<Card className="rounded-lg shadow-md border-0">
        <CardHeader className="border-b px-6 py-4 bg-white rounded-t-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#90DBF4]">رقم الإرسالية</Label>
                    <Input
                      defaultValue={message.NumeroMessagerie}
                      onChange={(e) => handleChange('NumeroMessagerie', e.target.value)}
                      className="bg-white text-gray-800 border-gray-300"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-600">الرقم الترتيبي:</span>
                      <span className="text-gray-800">{message.NumeroOrdre}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-600">رقم الإرسالية:</span>
                      <span className="text-gray-800">{message.NumeroMessagerie}</span>
                    </div>
                  </>

                )}
              </CardTitle>

              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">تاريخ الإرسال:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      // defaultValue={message.DateMessage.toISOString().split('T')[0]}
                      onChange={(e) => handleChange('DateMessage', new Date(e.target.value))}
                      className="bg-white text-gray-800 border-gray-300 w-full max-w-[180px]"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {format(new Date(message.DateMessage), "dd/MM/yyyy")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">تاريخ الوصول:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      // defaultValue={message.DateArrivee?.toISOString().split('T')[0]}
                      onChange={(e) => handleChange('DateArrivee', e.target.value ? new Date(e.target.value) : null)}
                      className="bg-white text-gray-800 border-gray-300 w-full max-w-[180px]"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {message.DateArrivee ? format(new Date(message.DateArrivee), "dd/MM/yyyy") : "---"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">

              <Label className="text-sm font-medium text-gray-600 block mb-1 mr-2">الحالة</Label>
              {isEditing ? (
                <div className="min-w-[150px]">
                  <Select
                    dir="rtl"
                    defaultValue={message.Statut}
                    onValueChange={(value) => handleChange('Statut', value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="منجز" className="hover:bg-white">منجز</SelectItem>
                      <SelectItem value="غير منجز" className="hover:bg-white">غير منجز</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Badge
                  variant={message.Statut === "منجز" ? "default" : "destructive"}
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {message.Statut}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            {/* Message Type */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">طبيعة المراسلة</Label>
              {
                isEditing ? (<div className="w-full">
                  <Select
                    dir="rtl"
                    // defaultValue={message.TypeMessageries?.Libelle}
                    value={editedData.IdType?.toString() || message.IdType?.toString()}
                    onValueChange={(value) => handleChange('IdType', parseInt(value))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 w-full">
                      {getTypeLibelle(editedData.IdType ?? message.IdType)}
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1" className="hover:bg-white">وارد</SelectItem>
                      <SelectItem value="2" className="hover:bg-white">صادر</SelectItem>
                      <SelectItem value="3" className="hover:bg-white">وارد_صادر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>) : (
                  <p className="text-gray-800 font-medium">{message.TypeMessageries?.Libelle || "---"}</p>
                )
              }
            </div>

            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">نوع المراسلة</Label>
              {
                isEditing ? (<div className="w-full">
                  <Select
                    dir="rtl"
                    value={editedData.TypeDocument || message.TypeDocument}
                    onValueChange={(value) => handleChange('TypeDocument', value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-800 w-full">
                      {editedData.TypeDocument || message.TypeDocument} {/* Fixed this line */}
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="إرسالية" className="hover:bg-white">إرسالية</SelectItem>
                      <SelectItem value="كتاب" className="hover:bg-white">كتاب</SelectItem>
                    </SelectContent>
                  </Select>
                </div>) : (
                  <p className="text-gray-800 font-medium">{message.TypeDocument || "---"}</p>
                )
              }
            </div>

            {/* Barcode */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">رقم المضمون</Label>
              {isEditing ? (
                <Input
                  defaultValue={message.CodeBarre}
                  onChange={(e) => handleChange('CodeBarre', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{message.CodeBarre}</p>
              )}
            </div>

            {/* Reference */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">المرجع</Label>
              {isEditing ? (
                <Input
                  defaultValue={message.CodeReference || ""}
                  onChange={(e) => handleChange('CodeReference', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{message.CodeReference || "---"}</p>
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">اطراف المراسلة</Label>
              {isEditing ? (
                <Input
                  defaultValue={message.participants_courrier || ""}
                  onChange={(e) => handleChange('participants_courrier', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{message.participants_courrier || "---"}</p>
              )}
            </div>


            {/* Subject */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">الموضوع</Label>
              {isEditing ? (
                <Textarea
                  defaultValue={message.Sujet}
                  onChange={(e) => handleChange('Sujet', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 min-h-[100px]"
                />
              ) : (
                <p className="text-gray-800 font-medium whitespace-pre-line">
                  {message.Sujet || "---"}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white p-3 rounded-lg">
              <Label className="block text-sm font-medium text-gray-600 mb-1">ملاحظات</Label>
              {isEditing ? (
                <Textarea
                  defaultValue={message.Remarques || ""}
                  onChange={(e) => handleChange('Remarques', e.target.value)}
                  className="bg-white border-gray-300 text-gray-800 min-h-[100px]"
                />
              ) : (
                <p className="text-gray-800 font-medium whitespace-pre-line">
                  {message.Remarques || "---"}
                </p>
              )}
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg">
            {/* Source */}
            {(message.IdType === 1 || message.IdType === 3) && (
              isEditing ? (
                <div>
                  {/* Type Source */}
                  <div className="space-y-2 w-full">
                      <Label className="block text-sm font-medium text-gray-600 mb-1">اختيار نوع المرسل</Label>
                    <Select
                      value={selectedSourceType}
                      onValueChange={(value) => {
                        setSelectedSource("");
                        setSelectedSourceType(value);
                      }}
                    >
                      <SelectTrigger className="w-full" dir="rtl">
                        <SelectValue placeholder="اختر نوع المرسل ..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((type) => (
                          <SelectItem
                            key={type.IdTypeSource}
                            value={type.IdTypeSource.toString()}
                          >
                            {type.Libelle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {Number(selectedSourceType) != 5 && (
                    <div className="space-y-2 w-full mt-6">
                        <Label className="block text-sm font-medium text-gray-600 mb-1">اختيار المرسل</Label>
                      <SearchableSelect
                        items={sources}
                        value={selectedSource}
                        onValueChange={(value) => {
                          setSelectedSource(value);
                          handleChange('IdSource', Number(value));
                        }}
                        placeholder="اختر المرسل إليه"
                        searchPlaceholder="ابحث عن المرسل إليه..."
                        renderItem={(source: any) => (
                          <div>
                            <span>{source.NomSource}</span>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-3 rounded-lg">
                  <Label className="block text-sm font-medium text-gray-600 mb-1">المرسل</Label>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-800 font-medium">
                      {message.Sources?.NomSource || message.AutreLibelleSource || "---"}
                    </p>
                  </div>
                </div>
              )
            )}
            </div>

            {/* distination */}
            <div className="bg-white p-3 rounded-lg">

            {
              (message.IdType === 3 || message.IdType === 2) ? (
                isEditing ? (
                  <div>
                    {/* Type Source */}
                    <div className="space-y-2 w-full">
                        <Label className="block text-sm font-medium text-gray-600 mb-1">اختيار نوع المرسل إليه</Label>
                      <Select
                        value={selectedSourceDestinationType}
                        onValueChange={(value) => {
                          setSelectedSourceDestination("");
                          setSelectedSourceDestinationType(value);
                          
                        }}
                      >
                        <SelectTrigger className="w-full" dir="rtl">
                          <SelectValue placeholder="اختر نوع المرسل ..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceTypes.map((type) => (
                            <SelectItem
                              key={type.IdTypeSource}
                              value={type.IdTypeSource.toString()}
                            >
                              {type.Libelle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(Number(selectedSourceDestinationType) != 5) ? (
                      <div className="space-y-2 w-full mt-6">
                          <Label className="block text-sm font-medium text-gray-600 mb-1">اختيار المرسل إليه</Label>
                        <SearchableSelect
                          items={sourcesDestination}
                          value={selectedSourceDestination}
                          onValueChange={(value) => {
                            setSelectedSourceDestination(value);
                            handleChange('IdSourceDestination', Number(value)); 
                          }}
                          placeholder="اختر المرسل إليه "
                          searchPlaceholder="ابحث عن المرسل إليه..."
                          renderItem={(source: any) => (
                            <div>
                              <span>{source.NomSource}</span>
                            </div>
                          )}
                        />
                      </div>
                    ) :
                      null
                    }
                  </div>
                ) :
                  (
                    <div className="bg-white p-3 rounded-lg">
                      <Label className="block text-sm font-medium text-gray-600 mb-1">المرسل إليه</Label>

                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-gray-800 font-medium">{message.Sources_Messageries_IdSourceDestinationToSources?.NomSource || message.AutreLibelleDestination}</p>
                      </div>

                    </div>)
              ) : null
            }
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-white px-6 py-4 rounded-b-lg border-t flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveChanges}
                className=" text-white"

                variant="default"
              >
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="default"
              className=""
            >
              تعديل
            </Button>
          )}
        </CardFooter>
      </Card>