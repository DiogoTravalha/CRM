import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import listPlugin from "@fullcalendar/list";
import locale from "@fullcalendar/core/locales/pt-br";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { CustomDialog, Dialog, useDialog } from "react-st-modal";

import moment from "moment";
import {
  FormGroup,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
  Container,
} from "reactstrap";
import { useAuth } from "../../components/context";
import api from "../../api";

function FullCalendarApp() {
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState("");

  const { events, scheduleTag, SearchEvents, SearchScheduleTag } = useAuth();

  function CustomDialogContent(dados) {
    const dialog = useDialog();
    const [value, setValue] = useState("");
    const [color, setColor] = useState("");
    const [status, setStatus] = useState("");

    function updadeStatus(e) {
      let idx = e.target.selectedIndex;
      let dataset = e.target.options[idx].dataset;
      setColor(dataset.isd);
      setStatus(e.target.value);
    }

    useEffect(() => {}, [color, status, value]);

    return (
      <FormGroup style={{ padding: "20px" }}>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-single-02" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Titulo"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => updadeStatus(e)}
            value={status}
            defaultValue="Selecione"
          >
            <option value="Selecione">Selecione</option>
            {scheduleTag.map((item) => (
              <option data-isd={item.valor} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </Input>
        </InputGroup>
        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={() => {
              if (value === "" || color === "" || status === "") {
                alert("Preencha os campos");
              } else {
                addDate(dados, value, dialog, color, status);
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => dialog.close(value)}>Cancelar</Button>
        </div>
      </FormGroup>
    );
  }

  function DeletContent(dados) {
    const dialog = useDialog();
    const [value, setValue] = useState(dados.dados.event.title);
    const [color, setColor] = useState(dados.dados.event.backgroundColor);
    const [status, setStatus] = useState(
      dados.dados.event._def.extendedProps.status
    );

    function updadeStatus(e) {
      let idx = e.target.selectedIndex;
      let dataset = e.target.options[idx].dataset;
      setColor(dataset.isd);
      setStatus(e.target.value);
    }

    useEffect(() => {}, [color, value, status]);

    return (
      <FormGroup>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-single-02" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Titulo"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => updadeStatus(e)}
            value={status}
            defaultValue="Selecione"
          >
            <option value="Selecione">Selecione</option>
            {scheduleTag.map((item) => (
              <option data-isd={item.valor} value={item.nome}>
                {item.nome}
              </option>
            ))}
          </Input>
        </InputGroup>
        <Button
          className="bg-info"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={() => {
            attDate(dados, value, dialog, color, status);
          }}
        >
          Atualizar
        </Button>
        <Button
          className="bg-danger"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={() => {
            delDate(dados, value, dialog);
          }}
        >
          Deletar
        </Button>
        <Button
          className="bg-"
          onClick={() => dialog.close(value)}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Cancelar
        </Button>
      </FormGroup>
    );
  }

  async function attDate(dados, value, dialog, color, status) {
    const agenda_title = value;
    const agenda_color = color;
    const agenda_start = dados.dados.event.startStr;
    const agenda_end = dados.dados.event.startStr;
    const agenda_year = ano;
    const agenda_status = status;

    const body = {
      agenda_title,
      agenda_color,
      agenda_start,
      agenda_end,
      agenda_year,
      agenda_status,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/schedule/update/${dados.dados.event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      SearchEvents(mes);
      dialog.close();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function delDate(dados, value, dialog) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/schedule/delete/${dados.dados.event.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      SearchEvents(mes);
      dialog.close();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function addDate(dados, value, dialog, color, status) {
    const agenda_title = value;
    const agenda_color = color;
    const agenda_start = dados.dados.dateStr;
    const agenda_end = dados.dados.dateStr;
    const agenda_year = ano;
    const agenda_status = status;

    const body = {
      agenda_title,
      agenda_color,
      agenda_start,
      agenda_end,
      agenda_year,
      agenda_status,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/schedule/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      console.log("Add", response);
      SearchEvents(mes);
      dialog.close(value);
    } catch (err) {
      console.log("Add", err);
      console.error(err.message);
    }
  }

  async function dragAdd(info) {
    const agenda_title = info.event.title;
    const agenda_color = info.event.backgroundColor;
    const agenda_start = info.event.startStr;
    const agenda_end = info.event.startStr;
    const agenda_year = ano;
    const agenda_status = info.event._def.extendedProps.status;

    const body = {
      agenda_title,
      agenda_color,
      agenda_start,
      agenda_end,
      agenda_year,
      agenda_status,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/schedule/update/${info.event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      SearchEvents(mes);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    SearchScheduleTag();
    SearchEvents(mes);
  }, [ano, mes]);

  return (
    <Container>
      <div
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <FullCalendar
          contentHeight="auto"
          eventContent={function (info) {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "5px",
                  maxWidth: "150px",
                  whiteSpace: "break-spaces",
                  overflowWrap: "break-word",
                }}
              >
                <b>{info.event._def.extendedProps.status}</b>

                <br></br>
                <b style={{ color: "#000" }}>{info.event.title}</b>
              </div>
            );
          }}
          expandRows={true}
          showNonCurrentDates={false}
          locale={locale}
          nowIndicator={true}
          timeZone="America/Sao_Paulo"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
          /*   customButtons={{
                        Proximo: {
                            text: 'next',
                        },
                    }} */
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "dayGridMonth,listWeek",
            /* right: 'dayGridMonth,timeGridWeek,timeGridDay', */
          }}
          titleFormat={{
            year: "numeric",
            month: "short",
          }}
          datesSet={async function (info) {
            const data = new Date(info.startStr);
            setAno(moment(data).format("Y"));
            setMes(moment(data).format("M"));
          }}
          dayMaxEvents={1}
          editable={true}
          droppable={true}
          events={events}
          eventChange={async function (info) {
            dragAdd(info);
          }}
          handleWindowResize
          eventStartEditable={true}
          dateClick={async (e) => {
            const result = await CustomDialog(
              <CustomDialogContent dados={e} />,
              {
                title: "Adicionar Evento",
                showCloseIcon: true,
              }
            );
          }}
          eventClick={async (e) => {
            const result = await CustomDialog(<DeletContent dados={e} />, {
              title: "Deletar",
              showCloseIcon: true,
            });
          }}
        />
      </div>
    </Container>
  );
}

export default FullCalendarApp;
