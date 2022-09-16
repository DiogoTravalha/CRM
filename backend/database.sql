CREATE TABLE public.company (
	id serial PRIMARY KEY,
 	name varchar(255),
 	img varchar(255),
 	phone varchar(255),
 	address varchar(255),
 	number integer,
 	city varchar(255),
 	uf varchar(255)	
);

CREATE TABLE public.category (
	id serial PRIMARY KEY,
 	name varchar(255),
 	icon varchar(255),
	id_company integer,
	foreign key (id_company) references company(id)
);

CREATE TABLE public.product (
	id serial PRIMARY KEY,
 	name varchar(255),
 	img varchar(255),
 	price integer,
 	promo boolean,
 	description varchar(255),
 	pricePromo integer,
 	id_company integer, 	
	id_category integer,
	foreign key (id_category) references category(id)
);

CREATE TABLE public.additional (
	id serial PRIMARY KEY,
 	name varchar(255),
 	maxValues integer,
 	minValues integer,
 	defaultValues integer,
 	id_company integer, 	
	id_products integer,
	foreign key (id_products) references product(id)
);

CREATE TABLE public.option (
	id serial PRIMARY KEY,
 	name varchar(255), 	
 	maxValues integer, 	
 	defaultValue integer,
 	price integer,
 	id_company integer, 	
 	id_additional integer,
 	foreign key (id_additional) references additional(id)
);