BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Cadre] (
    [IdCadre] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK__Cadre__66176C04E68D8486] PRIMARY KEY CLUSTERED ([IdCadre])
);

-- CreateTable
CREATE TABLE [dbo].[CodeFilieres] (
    [IdCode] INT NOT NULL IDENTITY(1,1),
    [Valeur] NVARCHAR(100) NOT NULL,
    [IdFiliere] INT,
    [Libelle] NVARCHAR(100),
    CONSTRAINT [PK__CodeFili__37DBAFC635ADE29F] PRIMARY KEY CLUSTERED ([IdCode])
);

-- CreateTable
CREATE TABLE [dbo].[Etude] (
    [IdEtude] INT NOT NULL IDENTITY(1,1),
    [Etude] BIT,
    [DateEtude] DATE NOT NULL,
    [DateRetour] DATE NOT NULL,
    [IdMessagerie] INT NOT NULL,
    CONSTRAINT [PK__Etude__23BA6831E1880F75] PRIMARY KEY CLUSTERED ([IdEtude])
);

-- CreateTable
CREATE TABLE [dbo].[Filieres] (
    [IdFiliere] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    [AddedBy] NVARCHAR(100),
    [AddedDate] DATETIME CONSTRAINT [DF__Filieres__AddedD__75A278F5] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] NVARCHAR(100),
    [UpdatedDate] DATETIME,
    [DeletedBy] NVARCHAR(100),
    [DeletedDate] DATETIME,
    [IsDeleted] BIT CONSTRAINT [DF__Filieres__IsDele__76969D2E] DEFAULT 0,
    CONSTRAINT [PK__Filieres__556328670ECBA306] PRIMARY KEY CLUSTERED ([IdFiliere])
);

-- CreateTable
CREATE TABLE [dbo].[Messageries] (
    [IdMessagerie] INT NOT NULL IDENTITY(1,1),
    [NumeroOrdre] NVARCHAR(100) NOT NULL,
    [CodeMessagerie] NVARCHAR(100) NOT NULL,
    [CodeComplet] NVARCHAR(100) NOT NULL,
    [NumeroMessage] NVARCHAR(100) NOT NULL,
    [DateMessage] DATE NOT NULL,
    [DateArrivee] DATE,
    [Sujet] NVARCHAR(255) NOT NULL,
    [Expediteur] NVARCHAR(100) NOT NULL,
    [Destinataire] NVARCHAR(100),
    [Remarques] NVARCHAR(max),
    [Statut] NVARCHAR(100) NOT NULL,
    [IdType] INT,
    [IdProsecutor] INT,
    [IdCode] INT NOT NULL,
    [AddedBy] NVARCHAR(100),
    [AddedDate] DATETIME CONSTRAINT [DF__Messageri__Added__0A9D95DB] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] NVARCHAR(100),
    [UpdatedDate] DATETIME,
    [DeletedBy] NVARCHAR(100),
    [DeletedDate] DATETIME,
    [IdSource] INT,
    [IsDeleted] BIT CONSTRAINT [DF__Messageri__IsDel__0B91BA14] DEFAULT 0,
    [IdDocument] INT,
    CONSTRAINT [PK__Messager__89D73AEE80FE574E] PRIMARY KEY CLUSTERED ([IdMessagerie])
);

-- CreateTable
CREATE TABLE [dbo].[ProsecutorResponsables] (
    [IdResponsable] INT NOT NULL IDENTITY(1,1),
    [prenom] NVARCHAR(100) NOT NULL,
    [nom] NVARCHAR(100) NOT NULL,
    [AddedBy] NVARCHAR(100),
    [AddedDate] DATETIME CONSTRAINT [DF__Prosecuto__Added__02084FDA] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] NVARCHAR(100),
    [UpdatedDate] DATETIME,
    [DeletedBy] NVARCHAR(100),
    [DeletedDate] DATETIME,
    [IsDeleted] BIT CONSTRAINT [DF__Prosecuto__IsDel__02FC7413] DEFAULT 0,
    CONSTRAINT [PK__Prosecut__CCF9B55092788729] PRIMARY KEY CLUSTERED ([IdResponsable])
);

-- CreateTable
CREATE TABLE [dbo].[Reponses] (
    [IdReponse] INT NOT NULL IDENTITY(1,1),
    [DateReponse] DATE NOT NULL,
    [Contenu] NVARCHAR(max) NOT NULL,
    [IdMessagerie] INT NOT NULL,
    [IdSource] INT,
    [AddedBy] NVARCHAR(100),
    [AddedDate] DATETIME CONSTRAINT [DF__Reponses__AddedD__123EB7A3] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] NVARCHAR(100),
    [UpdatedDate] DATETIME,
    [DeletedBy] NVARCHAR(100),
    [DeletedDate] DATETIME,
    [IsDeleted] BIT CONSTRAINT [DF__Reponses__IsDele__1332DBDC] DEFAULT 0,
    CONSTRAINT [PK__Reponses__F886310035350033] PRIMARY KEY CLUSTERED ([IdReponse])
);

-- CreateTable
CREATE TABLE [dbo].[Resultats] (
    [IdResultat] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    [IdMessagerie] INT NOT NULL,
    [AddedBy] NVARCHAR(100),
    [AddedDate] DATETIME CONSTRAINT [DF__Resultats__Added__1AD3FDA4] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedBy] NVARCHAR(100),
    [UpdatedDate] DATETIME,
    [DeletedBy] NVARCHAR(100),
    [DeletedDate] DATETIME,
    [IsDeleted] BIT CONSTRAINT [DF__Resultats__IsDel__1BC821DD] DEFAULT 0,
    CONSTRAINT [PK__Resultat__8DAFBE8DA9B243CD] PRIMARY KEY CLUSTERED ([IdResultat])
);

-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [IdRole] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK__Roles__B4369054CC73151C] PRIMARY KEY CLUSTERED ([IdRole])
);

-- CreateTable
CREATE TABLE [dbo].[Sources] (
    [IdSource] INT NOT NULL IDENTITY(1,1),
    [NomSource] NVARCHAR(100) NOT NULL,
    [IdTypeSource] INT,
    CONSTRAINT [PK__Sources__AE5E01B9108369EA] PRIMARY KEY CLUSTERED ([IdSource])
);

-- CreateTable
CREATE TABLE [dbo].[TypeMessageries] (
    [IdType] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK__TypeMess__9A39EABC9AE62619] PRIMARY KEY CLUSTERED ([IdType])
);

-- CreateTable
CREATE TABLE [dbo].[TypeSource] (
    [IdTypeSource] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK__TypeSour__112C02087BCD47FC] PRIMARY KEY CLUSTERED ([IdTypeSource])
);

-- CreateTable
CREATE TABLE [dbo].[UserFonctionne] (
    [IdUserFonctionne] INT NOT NULL IDENTITY(1,1),
    [Libelle] NVARCHAR(100) NOT NULL,
    CONSTRAINT [PK__UserFonc__6AFC9D3F9FF0A4BB] PRIMARY KEY CLUSTERED ([IdUserFonctionne])
);

-- CreateTable
CREATE TABLE [dbo].[UtilisateurFiliere] (
    [IdUtilisateur] INT NOT NULL,
    [IdFiliere] INT NOT NULL,
    CONSTRAINT [PK__Utilisat__20F2F3D101D1A090] PRIMARY KEY CLUSTERED ([IdUtilisateur],[IdFiliere])
);

-- CreateTable
CREATE TABLE [dbo].[Utilisateurs] (
    [IdUtilisateur] INT NOT NULL IDENTITY(1,1),
    [CodeUtilisateur] INT NOT NULL,
    [MotDePasse] NVARCHAR(100) NOT NULL,
    [Nom] NVARCHAR(100) NOT NULL,
    [Prenom] NVARCHAR(100) NOT NULL,
    [Tel] NVARCHAR(20),
    [Email] NVARCHAR(100),
    [DateEmbauche] DATE NOT NULL,
    [DateAffectation] DATE NOT NULL,
    [IdRole] INT NOT NULL,
    [IsDeleted] BIT CONSTRAINT [DF__Utilisate__IsDel__71D1E811] DEFAULT 0,
    [IdCadre] INT,
    [IdUserFonctionne] INT,
    [UserName] NVARCHAR(100),
    CONSTRAINT [PK__Utilisat__45A4C15734AEA3A7] PRIMARY KEY CLUSTERED ([IdUtilisateur])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_CodeFilieres_IdFiliere] ON [dbo].[CodeFilieres]([IdFiliere]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_CodeFilieres_Valeur] ON [dbo].[CodeFilieres]([Valeur]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Etude_DateEtude_DateRetour] ON [dbo].[Etude]([DateEtude], [DateRetour]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Etude_IdMessagerie] ON [dbo].[Etude]([IdMessagerie]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Filieres_IsDeleted] ON [dbo].[Filieres]([IsDeleted]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Filieres_Libelle] ON [dbo].[Filieres]([Libelle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_CodeComplet] ON [dbo].[Messageries]([CodeComplet]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_DateMessage] ON [dbo].[Messageries]([DateMessage]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_Expediteur] ON [dbo].[Messageries]([Expediteur]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_IdCode] ON [dbo].[Messageries]([IdCode]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_IdDocument] ON [dbo].[Messageries]([IdDocument]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_IdProsecutor] ON [dbo].[Messageries]([IdProsecutor]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_IdType] ON [dbo].[Messageries]([IdType]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_IsDeleted] ON [dbo].[Messageries]([IsDeleted]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_NumeroOrdre] ON [dbo].[Messageries]([NumeroOrdre]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Messageries_Statut] ON [dbo].[Messageries]([Statut]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_ProsecutorResponsables_IsDeleted] ON [dbo].[ProsecutorResponsables]([IsDeleted]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_ProsecutorResponsables_NomPrenom] ON [dbo].[ProsecutorResponsables]([nom], [prenom]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Reponses_DateReponse] ON [dbo].[Reponses]([DateReponse]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Reponses_IdMessagerie] ON [dbo].[Reponses]([IdMessagerie]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Reponses_IdSource] ON [dbo].[Reponses]([IdSource]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Resultats_IdMessagerie] ON [dbo].[Resultats]([IdMessagerie]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Resultats_Libelle] ON [dbo].[Resultats]([Libelle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Roles_Libelle] ON [dbo].[Roles]([Libelle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Sources_IdTypeSource] ON [dbo].[Sources]([IdTypeSource]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Sources_NomSource] ON [dbo].[Sources]([NomSource]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_TypeMessageries_Libelle] ON [dbo].[TypeMessageries]([Libelle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_TypeSource_Libelle] ON [dbo].[TypeSource]([Libelle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Utilisateurs_CodeUtilisateur] ON [dbo].[Utilisateurs]([CodeUtilisateur]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Utilisateurs_IdRole] ON [dbo].[Utilisateurs]([IdRole]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Utilisateurs_NomPrenom] ON [dbo].[Utilisateurs]([Nom], [Prenom]);

-- AddForeignKey
ALTER TABLE [dbo].[CodeFilieres] ADD CONSTRAINT [FK__CodeFilie__IdFil__440B1D61] FOREIGN KEY ([IdFiliere]) REFERENCES [dbo].[Filieres]([IdFiliere]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Etude] ADD CONSTRAINT [FK__Etude__IdMessage__5EBF139D] FOREIGN KEY ([IdMessagerie]) REFERENCES [dbo].[Messageries]([IdMessagerie]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messageries] ADD CONSTRAINT [FK__Messageri__IdCod__5535A963] FOREIGN KEY ([IdCode]) REFERENCES [dbo].[CodeFilieres]([IdCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messageries] ADD CONSTRAINT [FK__Messageri__IdPro__5441852A] FOREIGN KEY ([IdProsecutor]) REFERENCES [dbo].[ProsecutorResponsables]([IdResponsable]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messageries] ADD CONSTRAINT [FK__Messageri__IdSou__5629CD9C] FOREIGN KEY ([IdSource]) REFERENCES [dbo].[Sources]([IdSource]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Messageries] ADD CONSTRAINT [FK__Messageri__IdTyp__534D60F1] FOREIGN KEY ([IdType]) REFERENCES [dbo].[TypeMessageries]([IdType]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reponses] ADD CONSTRAINT [FK__Reponses__IdMess__5AEE82B9] FOREIGN KEY ([IdMessagerie]) REFERENCES [dbo].[Messageries]([IdMessagerie]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reponses] ADD CONSTRAINT [FK__Reponses__IdSour__5BE2A6F2] FOREIGN KEY ([IdSource]) REFERENCES [dbo].[Sources]([IdSource]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Resultats] ADD CONSTRAINT [FK__Resultats__IdMes__6383C8BA] FOREIGN KEY ([IdMessagerie]) REFERENCES [dbo].[Messageries]([IdMessagerie]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Sources] ADD CONSTRAINT [FK__Sources__IdTypeS__4E88ABD4] FOREIGN KEY ([IdTypeSource]) REFERENCES [dbo].[TypeSource]([IdTypeSource]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UtilisateurFiliere] ADD CONSTRAINT [FK__Utilisate__IdFil__412EB0B6] FOREIGN KEY ([IdFiliere]) REFERENCES [dbo].[Filieres]([IdFiliere]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UtilisateurFiliere] ADD CONSTRAINT [FK__Utilisate__IdUti__403A8C7D] FOREIGN KEY ([IdUtilisateur]) REFERENCES [dbo].[Utilisateurs]([IdUtilisateur]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Utilisateurs] ADD CONSTRAINT [FK__Utilisate__IdRol__398D8EEE] FOREIGN KEY ([IdRole]) REFERENCES [dbo].[Roles]([IdRole]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Utilisateurs] ADD CONSTRAINT [FK_Utilisateurs_Cadre] FOREIGN KEY ([IdCadre]) REFERENCES [dbo].[Cadre]([IdCadre]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Utilisateurs] ADD CONSTRAINT [FK_Utilisateurs_UserFonctionne] FOREIGN KEY ([IdUserFonctionne]) REFERENCES [dbo].[UserFonctionne]([IdUserFonctionne]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
