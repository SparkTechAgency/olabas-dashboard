import { useParams } from "react-router-dom";
import { Form, Select, Button, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ExtraServices from "./ExtraServices";
import ProtectionServices from "./ProtectionServices";
import PickUpAndReturn from "./PickUp&Return";
import Details from "./Details";
import Vehicle from "./Vehicle";
import { useGetReservationByIdQuery } from "../../../../redux/apiSlices/reservation";
import {
  clearReservationData,
  setError,
  setLoading,
  setReservationData,
} from "../../../../redux/features/EditReservationSlice";

export default function ReservationEdit() {
  const { id } = useParams(); // comes from /edit-reservation/:id
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Get data from API
  const {
    data: reservationData,
    isLoading,
    error,
  } = useGetReservationByIdQuery(id);

  // Get Redux state
  const reservationState = useSelector((state) => state.editReservation);

  // Effect to populate Redux when data is fetched
  useEffect(() => {
    if (reservationData?.data) {
      console.log("Setting reservation data in Redux:", reservationData.data);
      dispatch(setReservationData(reservationData.data));
    }
  }, [reservationData, dispatch]);

  // Effect to handle loading states
  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (error) {
      dispatch(setError(error));
    }
  }, [isLoading, error, dispatch]);

  // Effect to populate form when Redux state is updated
  useEffect(() => {
    if (reservationState.bookingId && reservationData?.data) {
      const data = reservationData.data;

      // Set form fields with the data
      form.setFieldsValue({
        // Pickup and Return
        pickupDate: data.pickupDate ? moment(data.pickupDate) : null,
        pickupTime: data.pickupTime ? moment(data.pickupTime) : null,
        pickupLocation: data.pickupLocation?._id,
        returnDate: data.returnDate ? moment(data.returnDate) : null,
        returnTime: data.returnTime ? moment(data.returnTime) : null,
        returnLocation: data.returnLocation?._id,

        // Vehicle
        vehicle: data.vehicle?._id,
        vehicleType: data.vehicleType,

        // Client details
        firstName: data.clientId?.firstName,
        lastName: data.clientId?.lastName,
        email: data.clientId?.email,
        phone: data.clientId?.phone,
        parmanentAddress: data.clientId?.parmanentAddress,
        presentAddress: data.clientId?.presentAddress,
        country: data.clientId?.country,
        state: data.clientId?.state,
        postCode: data.clientId?.postCode,

        // Payment
        paymentMethod: data.paymentMethod,
        status: data.status,
      });
    }
  }, [reservationState.bookingId, reservationData, form]);

  // Clear Redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(clearReservationData());
    };
  }, [dispatch]);

  /* ------------
     SUBMIT
  -------------*/
  const onFinish = (values) => {
    const payload = {
      ...values,
      pickupDate: values.pickupDate.format("DD/MM/YYYY"),
      pickupTime: values.pickupTime.format("HH:mm"),
      returnDate: values.returnDate.format("DD/MM/YYYY"),
      returnTime: values.returnTime.format("HH:mm"),
    };

    console.log("Submitting reservation", payload);
    message.success("Reservation saved!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading reservation data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">
          Error loading reservation: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg h-[94%] overflow-auto [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* ──────────── 1. PICK‑UP / RETURN ──────────── */}
        <PickUpAndReturn />

        {/* ──────────── 2. VEHICLE / SIZE ──────────── */}
        <Vehicle />

        {/* ──────────── 4. EXTRA SERVICES ──────────── */}
        <div className="bg-white shadow-sm rounded-lg  mb-8">
          <ExtraServices />
          <ProtectionServices />
        </div>

        {/* ──────────── 3. RENTER DETAILS ──────────── */}
        <Details />

        {/* ──────────── 5. SUBMIT ──────────── */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Reservation
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
