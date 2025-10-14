## Adding new user and creating API token on Proxmox

Luo uusi käyttäjäjärjestelmän PAM-realmia varten (-m luo kotihakemiston, -s määrittää shellin)
	useradd -m -s /bin/bash <apiuser>

Aseta salasana
	passwd <apiuser>

Lisää käyttäjä Proxmoxiin
	pveum user add <apiuser>@pam

Lisää rooli ja oikeudet (PVEAuditor näkee kaiken, muttei pysty muokkaamaan)
	pveum acl modify / -user <apiuser>@pam -role PVEAuditor

Lisää käyttäjälle oikeus käynnistää ja sammuttaa VM 1017
	pveum acl modify /vms/1017 -user <apiuser>@pam -role PVEVMUser

Luo token käyttäjälle apiuser@pam
	pveum user token add <apiuser>@pam <tokenname>

Tulostaa tokenin arvon (näytetään vain kerran!)
	pveum user token list <apiuser>@pam
