"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, NextUIProvider, Textarea } from "@nextui-org/react";
import axios from "axios";

const questions = [
  "What type of property are you selling?",
  "How much do you think it is worth?",
  "How soon are you looking to sell?",
  "How many bedrooms are in the home?",
  "How many bathrooms are in the home?",
  "Would you link to receive a no-obligation offer for your home?",
  "We've received your information. Our team will contact you in just a few moments.",
];

const options = [
  [
    "Single Family House",
    "Townhouse",
    "Condo",
    "Mobile Home",
    "Multifamily",
    "Not Sure",
  ],
  [
    "Less Than $100,000",
    "$100,000 - $250,000",
    "$250,000 - $500,000",
    "$500,000 - $1,000,000",
    "More Than $1,000,000",
    "Not Sure",
  ],
  [
    "As Soon As Possible",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "12+ months",
    "Not Sure",
  ],
  ["1", "2", "3", "4", "5+", "Not Sure"],
  ["1", "2", "3", "4", "5+", "Not Sure"],
  ["Yes", "No"],
  ["DO YOU HAVE ANOTHER HOUSE TO SELL?"],
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

export default function Home() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [value, setValue] = useState(["", "", "", "", "", ""]);

  const paginate = (newDirection: number) => {
    if (newDirection === 1 && page < questions.length - 1) {
      setPage([page + newDirection, newDirection]);
    } else if (newDirection === -1 && page > 0) {
      setPage([page + newDirection, newDirection]);
    }
  };

  const setOptionValue = async (page: any, option: any) => {
    if (page < 5) {
      let temp: string[] = [];
      value.map((row, index) => {
        if (index === page) temp.push(option);
        else temp.push(row);
      });
      setValue(temp);
      setTimeout(() => {
        paginate(1);
      }, 500);
    } else if (page === 5) {
      const form = document.getElementById("info") as HTMLFormElement;
      const formData = new FormData(form);

      if (form?.checkValidity()) {
        let temp2: string[] = [];
        value.map((row, index) => {
          if (index === page) temp2.push(option);
          else temp2.push(row);
        });
        setValue(temp2);
        // need to send email

        const { data } = await axios.post("/api/send", {
          data: {
            contact: {
              firstname: formData.get("first"),
              lastname: formData.get("last"),
              phone: formData.get("phone"),
              email: formData.get("email"),
              description: formData.get("detail"),
            },
            value: temp2,
          },
        });
        if (data === "success") {
          setTimeout(() => {
            paginate(1);
          }, 500);
        }
      }
    }
  };

  const resetAll = () => {
    setValue(["", "", "", "", "", ""]);
    setPage([0, 1]);
  };

  const formSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log("Form submitted with values:", {
      firstname: data.get("first"),
      lastname: data.get("last"),
      phone: data.get("phone"),
      email: data.get("email"),
      description: data.get("detail"),
    });
  };

  return (
    <NextUIProvider>
      <div className="flex w-full h-full justify-center bg-[#FBFBFB] flex-col items-center font-[Poppins]">
        <span className="text-[#24B23D] text-[40px] mt-10 font-bold">
          Contact Us
        </span>
        <span className="text-[#717171] text-[18px] font-medium mt-[10px] px-2">
          Get a competitive offer for your Home
        </span>
        <div className="flex md:flex-nowrap md:flex-row flex-col max-w-[1200px] w-full md:h-[680px] h-max-content bg-white p-[8px] rounded-[10px] shadow-lg mt-[32px]">
          <form
            id="info"
            className="dark relative bg-[#011C2A] md:w-[491px] w-full h-full rounded-[10px] p-[40px] text-white overflow-hidden"
            onSubmit={formSubmit}
          >
            <div className="text-[28px] font-semibold">Contact Information</div>
            <div className="text-[#C9C9C9] text-[18px]">
              Say something to start a live chat!
            </div>
            <div className="mt-[32px] flex gap-[25px] md:flex-row flex-col">
              <Input
                variant="underlined"
                label="First Name"
                name="first"
                isRequired
              />
              <Input
                variant="underlined"
                label="Last Name"
                name="last"
                isRequired
              />
            </div>
            <div className="mt-[32px] flex gap-[25px] items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 10.999H22C22 5.869 18.127 2 12.99 2V4C17.052 4 20 6.943 20 10.999Z"
                  fill="white"
                />
                <path
                  d="M13 7.99999C15.103 7.99999 16 8.89699 16 11H18C18 7.77499 16.225 5.99999 13 5.99999V7.99999ZM16.422 13.443C16.2299 13.2683 15.9774 13.1752 15.7178 13.1832C15.4583 13.1912 15.212 13.2998 15.031 13.486L12.638 15.947C12.062 15.837 10.904 15.476 9.71204 14.287C8.52004 13.094 8.15904 11.933 8.05204 11.361L10.511 8.96699C10.6975 8.78612 10.8062 8.53982 10.8142 8.2802C10.8222 8.02059 10.7289 7.76804 10.554 7.57599L6.85904 3.51299C6.68408 3.32035 6.44092 3.2035 6.18119 3.18725C5.92146 3.17101 5.66564 3.25665 5.46804 3.42599L3.29804 5.28699C3.12515 5.46051 3.02196 5.69145 3.00804 5.93599C2.99304 6.18599 2.70704 12.108 7.29904 16.702C11.305 20.707 16.323 21 17.705 21C17.907 21 18.031 20.994 18.064 20.992C18.3086 20.9783 18.5394 20.8747 18.712 20.701L20.572 18.53C20.7415 18.3325 20.8273 18.0768 20.8113 17.817C20.7952 17.5573 20.6785 17.3141 20.486 17.139L16.422 13.443Z"
                  fill="white"
                />
              </svg>
              <Input
                variant="underlined"
                placeholder="Phone"
                name="phone"
                isRequired
              />
            </div>
            <div className="mt-[32px] flex gap-[25px] items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22 4H2V20H22V4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="white"
                />
              </svg>
              <Input
                type="email"
                variant="underlined"
                placeholder="Email"
                name="email"
                isRequired
              />
            </div>
            <div className="mt-[32px] flex gap-[25px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 1.5C9.81276 1.50258 7.71584 2.3726 6.16923 3.91922C4.62261 5.46584 3.75259 7.56276 3.75001 9.75C3.74739 11.5374 4.33124 13.2763 5.41201 14.7C5.41201 14.7 5.63701 14.9963 5.67376 15.039L12 22.5L18.3293 15.0353C18.3623 14.9955 18.588 14.7 18.588 14.7L18.5888 14.6978C19.669 13.2747 20.2526 11.5366 20.25 9.75C20.2474 7.56276 19.3774 5.46584 17.8308 3.91922C16.2842 2.3726 14.1873 1.50258 12 1.5ZM12 12.75C11.4067 12.75 10.8266 12.5741 10.3333 12.2444C9.83995 11.9148 9.45543 11.4462 9.22837 10.8981C9.00131 10.3499 8.9419 9.74667 9.05765 9.16473C9.17341 8.58279 9.45913 8.04824 9.87869 7.62868C10.2982 7.20912 10.8328 6.9234 11.4147 6.80764C11.9967 6.69189 12.5999 6.7513 13.1481 6.97836C13.6962 7.20542 14.1648 7.58994 14.4944 8.08329C14.8241 8.57664 15 9.15666 15 9.75C14.999 10.5453 14.6826 11.3078 14.1202 11.8702C13.5578 12.4326 12.7954 12.749 12 12.75Z"
                  fill="white"
                />
              </svg>
              <Textarea
                key="underlined"
                variant="underlined"
                placeholder="Enter your description"
                name="detail"
                isRequired
              />
            </div>
            <div className="absolute w-[138px] h-[138px] bg-[#FFF9F9] opacity-[.1] bottom-[70px] right-[70px] rounded-full "></div>
            <div className="absolute w-[269px] h-[269px] bg-white opacity-[.1] -bottom-[80px] -right-[80px] rounded-full "></div>
          </form>
          <div className="relative w-full min-h-[600px] overflow-hidden h-full md:p-[50px] p-[8px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute md:w-[calc(100%-100px)] w-[calc(100%-16px)]"
              >
                {questions[page]}
                <div
                  className="h-1 my-6 bg-[#008000] rounded-full"
                  style={{ width: `${((page + 1) / questions.length) * 100}%` }}
                />
                <div className="flex flex-wrap gap-4">
                  {options[page].map((option, index) => {
                    if (page < 5)
                      return (
                        <div
                          key={index}
                          className={`transition-all flex-1 flex justify-between gap-2 p-4 outline outline-2 min-w-[240px] bg-zinc-100 cursor-pointer group hover:outline-[#008000] hover:text-[#008000] ${
                            value[page] === option
                              ? "outline-[#008000] text-[#008000]"
                              : "outline-zinc-300"
                          }`}
                          onClick={() => setOptionValue(page, option)}
                        >
                          <div
                            className={`transition-all w-6 h-6 rounded-full bg-white outline outline-2 group-hover:outline-[#008000] ${
                              value[page] === option
                                ? "outline-[#008000]"
                                : "outline-zinc-300"
                            }`}
                          >
                            <div
                              className={`transition-all w-4 h-4 m-1 rounded-full ${
                                value[page] === option
                                  ? "bg-[#008000]"
                                  : "bg-white"
                              }`}
                            ></div>
                          </div>
                          <span className="mx-4">{option}</span>
                          <div />
                        </div>
                      );
                    else if (page === 5)
                      return (
                        <button
                          key={index}
                          form="info"
                          type="submit"
                          className={`transition-all flex-1 flex justify-between gap-2 p-4 outline outline-2 min-w-[240px] bg-zinc-100 cursor-pointer group hover:outline-[#008000] hover:text-[#008000] ${
                            value[page] === option
                              ? "outline-[#008000] text-[#008000]"
                              : "outline-zinc-300"
                          }`}
                          onClick={() => setOptionValue(page, option)}
                        >
                          <div
                            className={`transition-all w-6 h-6 rounded-full bg-white outline outline-2 group-hover:outline-[#008000] ${
                              value[page] === option
                                ? "outline-[#008000]"
                                : "outline-zinc-300"
                            }`}
                          >
                            <div
                              className={`transition-all w-4 h-4 m-1 rounded-full ${
                                value[page] === option
                                  ? "bg-[#008000]"
                                  : "bg-white"
                              }`}
                            ></div>
                          </div>
                          <span className="mx-4">{option}</span>
                          <div />
                        </button>
                      );
                    else
                      return (
                        <div
                          key={index}
                          className="transition-all flex-1 flex justify-center gap-2 p-4 outline outline-zinc-300 outline-2 min-w-[240px] bg-zinc-100 cursor-pointer group hover:outline-[#008000] hover:text-[#008000]"
                          onClick={() => resetAll()}
                        >
                          <span className="mx-4">{option}</span>
                          <div />
                        </div>
                      );
                  })}
                </div>
                {page > 0 && page < 6 && (
                  <div
                    className="prev transition-all mt-4 text-xs text-zinc-700 hover:text-zinc-900"
                    onClick={() => paginate(-1)}
                  >
                    {"<<Back"}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </NextUIProvider>
  );
}
